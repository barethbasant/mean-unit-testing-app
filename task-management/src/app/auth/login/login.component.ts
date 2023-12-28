import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  labelName = 'Login';
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['tasks/list']);
    }
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {}

  changeMode() {
    this.isLoginMode = !this.isLoginMode;
    this.labelName = this.isLoginMode ? 'Login' : 'Register';

    if (!this.isLoginMode) {
      this.loginForm.addControl(
        'fullName',
        new FormControl(null, Validators.required)
      );
    } else {
      this.loginForm.removeControl('fullName');
    }
  }

  onSubmit() {
    this.markFormGroupAsTouched(this.loginForm);
    if (this.loginForm.valid) {
      if (!this.isLoginMode) {
        this.onRegister();
      } else {
        this.onLogin();
      }
    }
  }

  onRegister() {
    this.authService.register(this.loginForm.value).subscribe(
      (data: any) => {
        this.loginForm.reset();
        this.toastr.success(data?.message, 'Success');
      },
      (err) => {
        // console.log(err);

        this.toastr.error(err.error.error, 'Error');
      }
    );
  }

  onLogin() {
    this.authService.login(this.loginForm.value).subscribe(
      (data: any) => {
        // console.log(data);

        if (data) {
          this.toastr.success('Login Successfully', 'Success');

          localStorage.setItem(environment.accessTokenKey, data.accessToken);
          localStorage.setItem(environment.fullName, data.data.fullName);
          localStorage.setItem(environment.refreshTokenKey, data.refreshToken);
          this.authService.username.next(data.data.username);
          this.router.navigate(['tasks/list']);
        }
      },
      (err) => {
        this.toastr.error(err.error.error, 'Error');
      }
    );
  }

  private markFormGroupAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
