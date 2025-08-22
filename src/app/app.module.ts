import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';

// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { provideHttpClient,withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2OrderModule } from 'ng2-order-pipe';

import { UpsertBookComponent } from './upsert-book/upsert-book.component';
import { BookIssueDetailsComponent } from './book-issue-details/book-issue-details.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './core/auth.interceptor';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    LoginComponent,
    
   
    UpsertBookComponent,
    BookIssueDetailsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    NgbPaginationModule,
    ReactiveFormsModule,
     NgbCollapseModule
    
    
  
  ],
  providers: [
     //provideHttpClient(),
      {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Ensure you add multiple interceptors if needed
    },
      provideHttpClient(withFetch()),
      provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class NgbdPaginationBasic {
	page = 4;
}
