import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false, 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']   
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  toggleShow(): void {
    this.showPassword = !this.showPassword;
  }

  submit(form: NgForm): void {
    debugger;
    if (form.invalid) {
      console.warn('[Login] Form invalid');
      return;
    }

    this.error = '';
    this.loading = true;

    const payload: LoginRequest = {
      Email: this.username.trim(),
      password: this.password,
    };
    debugger;
    console.log(payload.Email);
    console.log(payload.password);

    console.log('[Login] Submitting', payload.Email);

    this.auth.login(payload).subscribe({
     next: (res: any) => {
      debugger;
    this.loading = false;

  
    const user = { id: res.UserId, name: res.Name };
    debugger;
    localStorage.setItem('Stoken', res.Token);                
    localStorage.setItem('SUsername', JSON.stringify(user)); 
    this.router.navigateByUrl('/Home'); 
  },
      error: (err) => {
        console.error('[Login] Error:', err);
        this.loading = false;
        this.error = err?.error?.message || 'Invalid username or password.';
      },
    });
  }
}
