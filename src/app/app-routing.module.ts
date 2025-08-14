import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
//import { BookIssueDetailsComponent } from './book-issue-details/book-issue-details.component';
import { UpsertBookComponent } from './upsert-book/upsert-book.component';
import { BookIssueDetailsComponent } from './book-issue-details/book-issue-details.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'Home', component:HomeComponent},
  {path:'Test', component:TestComponent},
  {path:'Login', component:LoginComponent},
  {path: 'book/add', component: UpsertBookComponent },
  {path: 'book/edit/:id', component: UpsertBookComponent },
  {path: 'book/delete/:id', component:UpsertBookComponent},
  {path: 'add-issue', component:BookIssueDetailsComponent}
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
