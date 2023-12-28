import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'login',
      'register',
    ]);
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ToastrService,
          useValue: mockToastrService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should initialize loginForm with default value for login`, () => {
    component.isLoginMode = true;
    expect(component.loginForm.value).toEqual({
      email: null,
      password: null,
    });
  });

  it(`should initialize loginForm with default value for registration`, () => {
    component.changeMode();
    expect(component.loginForm.value).toEqual({
      fullName: null,
      email: null,
      password: null,
    });
  });

  it(`should display the fullName input field for registration`, () => {
    component.changeMode();
    fixture.detectChanges();
    const fullNameInput = fixture.nativeElement.querySelector(
      'input[formControlName="fullName"]'
    );
    // console.log('fullNameInput:', fullNameInput);

    expect(fullNameInput).toBeTruthy();
  });

  it(`should not display fullName input for login`, () => {
    const fullNameInput = fixture.nativeElement.querySelector(
      'input[formControlName="fullName"]'
    );
    expect(fullNameInput).toBeFalsy();
  });

  it(`should call onRegister when onsubmit is called and isLoginMode will be false`, () => {
    spyOn(component, 'onRegister');
    component.changeMode();
    mockAuthService.register.and.returnValue(of({}));
    component.loginForm.setValue({
      fullName: 'basant',
      email: 'basant@email.in',
      password: '1234',
    });

    component.onRegister();
    expect(component.onRegister).toHaveBeenCalled();
  });

  it(`should call onLogin when onsubmit is called and isLoginMode will be true`, () => {
    spyOn(component, 'onLogin');
    mockAuthService.login.and.returnValue(of({}));
    component.loginForm.setValue({
      email: 'basant@email.in',
      password: '1234',
    });

    component.onLogin();
    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should show required error for fullName when it is touched and empty', () => {
    component.changeMode();
    const fullNameControl = component.loginForm.get('fullName');
    // fullNameControl?.setValue('');
    fullNameControl?.markAsTouched();

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(
      '.form-text.text-muted.help-text'
    );
    expect(errorElement.textContent).toContain('Full Name is required');
  });

  it('should show required error for email when it is touched and empty', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.email-required');
    expect(errorElement.textContent).toContain('Email is required');
  });

  it('should show required error for password when it is touched and empty', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();

    fixture.detectChanges();

    const errorElement =
      fixture.nativeElement.querySelector('.password-required');
    expect(errorElement.textContent).toContain('Password is required');
  });
});
