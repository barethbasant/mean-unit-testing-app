import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment.development';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should register a user', () => {
    const userData = {
      fullName: 'basant xyz',
      email: 'basant@xyz.in',
      password: '1234',
    };

    service.register(userData).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.APIURL}/register`
    );
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should login a user', () => {
    const userData = {
      fullName: 'basant xyz',
      email: 'basant@xyz.in',
    };

    service.login(userData).subscribe();

    const req = httpTestingController.expectOne(`${environment.APIURL}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should clear localStorage on logout', () => {
    spyOn(localStorage, 'clear');

    service.logout();

    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should get token from localStorage', () => {
    const token = 'testToken';
    spyOn(localStorage, 'getItem').and.returnValue(token);

    const result = service.getToken();

    expect(result).toBe(token);
  });

  it('should set token in localStorage', () => {
    const token = 'testToken';
    spyOn(localStorage, 'setItem');

    service.setToken(token);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      environment.accessTokenKey,
      token
    );
  });

  it('should return true if user is authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testToken');

    const result = service.isAuthenticated();

    expect(result).toBeTruthy();
  });

  it('should return false if user is not authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = service.isAuthenticated();

    expect(result).toBeFalsy();
  });
});
