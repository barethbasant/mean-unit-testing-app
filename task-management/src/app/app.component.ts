import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthenticate = false;
  username: any;
  constructor(private authService: AuthService, private router: Router) {
    this.username = localStorage.getItem(environment.fullName);
    this.isAuthenticate = this.authService.isAuthenticated();
    this.authService.username.subscribe((data) => {
      this.username = localStorage.getItem(environment.fullName);
      this.isAuthenticate = this.authService.isAuthenticated();
    });
  }

  ngOnInit(): void {}
  logout() {
    this.authService.logout();
    this.authService.username.next('');
    this.router.navigate(['login']);
  }
}
