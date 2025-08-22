import { Injectable } from '@angular/core';
import { Session } from 'inspector';

@Injectable({
  providedIn: 'root',
})
export class UserService {
getUserName(): string {
  const raw = localStorage.getItem('SUsername');
  if (!raw) return '';
  try {
    const obj = JSON.parse(raw);
    return obj?.name ?? obj?.Name ?? '';
  } catch {
    
    return raw;
  }
}

isLoggedIn(): boolean {
  return !!localStorage.getItem('Stoken');
}

logout(): void {
  localStorage.removeItem('Stoken');
  localStorage.removeItem('SUsername');
}

}
