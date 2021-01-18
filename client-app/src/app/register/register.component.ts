import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { min } from 'rxjs/operators';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  user: User;
  error: any;
  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) { }

  ngOnInit(): void {
    this.createRegisterForm()
  }
  createRegisterForm() {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
    })
  }
  get f() { return this.registerForm.controls; }
  register() {
    if (this.registerForm.invalid) {
      return;
    }
    this.user = Object.assign({}, this.registerForm.value);
    this.loading = true;
    this.authService.register(this.user).pipe(
    ).subscribe(success => {
      this.loading = false;
    }, err => {
      this.error = err;
      this.loading = false;
    }, () => {
      this.authService.login(this.user.email).subscribe((res) => {
        this.route.navigate(['/message'])
      }, err => {
        this.error = err;
        this.loading = false;
      })
    }
    );
  }
}
