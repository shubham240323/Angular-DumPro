import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastService } from './toast.service'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'

  

})
export class AppComponent {
  constructor(public toastService: ToastService){
    
  }
  title = 'DumPro';
  
}



