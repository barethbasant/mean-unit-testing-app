import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { AuthguardGuard } from './auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthguardGuard', () => {
  let guard: AuthguardGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthguardGuard, AuthService],

    });

    guard = TestBed.inject(AuthguardGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);

    const canActivate = guard.canActivate(null as any, null as any);

    expect(canActivate).toBeTruthy();
  });

  it('should navigate to login page when user is not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
