import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly url = environment.APIURL;
  private tokenKey = environment.accessTokenKey;
  username = new Subject<string | null>();
  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post(`${this.url}/register`, userData);
  }

  login(userData: any) {
    return this.http.post(`${this.url}/login`, userData);
  }

  logout() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }
}
