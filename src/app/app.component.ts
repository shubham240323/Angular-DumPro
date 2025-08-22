// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements OnInit {
  title = 'DumPro';
  userName = '';
  loggedIn = false;
   isCollapsed = true; 

  constructor(
    public toastService: ToastService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const refresh = () => {
      this.loggedIn = this.userService.isLoggedIn();
      this.userName = this.userService.getUserName(); 
    };
    refresh();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => refresh());
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
