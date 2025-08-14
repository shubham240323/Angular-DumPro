import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { Book } from '../booksmodels/book.model';
import { SearchFilters } from '../models/search-filters.model';
// import { HomeComponent } from '../home/home.component';
import { ToastService } from '../toast.service';
import { error } from 'console';

@Component({
  selector: 'app-upsert-book',
  templateUrl: './upsert-book.component.html',
  standalone:false
})
export class UpsertBookComponent implements OnInit {
  book: Book=new Book();
  publications: any[];
  departments: any[];
  queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private router: Router ,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDropdowns(); 

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.homeService.GetBookById(Number(id)).subscribe({
        next: (data: Book) => {
          console.log('Fetched Book:', data);
          this.book = data;
        }
      });
    } else {
      this.book = new Book();
    }
  }

  loadDropdowns() {
    this.homeService.DepartmentGetList().subscribe({
      next: (res) => this.departments = res
    });

    this.homeService.PublicationsGetList().subscribe({
      next: (res) => this.publications = res
    });
  }

  saveBook(): void {
    this.homeService.saveBook(this.book).subscribe({
      next: (res: any) => {
        debugger;
        console.log("I am inside saveBook");
        this.toastService.show("Book Saved Successfully");
        this.router.navigate(['/Home']);
      },
      error: () => {
        this.toastService.show("Error While Saving Book!");
      }
    });
  }
}
