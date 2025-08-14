import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { 


  }
  toasts: any[] = [];
  

  show(text: string ) {
    this.toasts.push({ text});
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
} 
