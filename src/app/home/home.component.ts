import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
import { SearchFilters } from '../models/search-filters.model';
import { write } from 'fs';
import { count } from 'console';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../booksmodels/book.model';
import Swal from 'sweetalert2';
import { ToastService } from '../toast.service';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  @ViewChild('bookModal') bookModal!: TemplateRef<any>;

  books: any[] = [];
  vendors: any[] = [];
  departments: any[] = [];
  department: number = 0;
  filters = new SearchFilters();
  selectedBook: Book = new Book();

  pageSizes: number[] = [5, 10, 20, 50];
  totalRecords: number = 0;
  totalPages: number = 0;
  sort = {
    column: '',
    direction: ''
  };

  constructor(
    private homeService: HomeService,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {
    this.loadDropdowns();
    this.GetBookList();
  }

  loadDropdowns(): void {
    this.homeService.DepartmentGetList().subscribe({
      next: (departments: any[]) => {
        this.departments = departments ?? [];

        this.homeService.PublicationsGetList().subscribe({
          next: (vendors: any[]) => {
            this.vendors = vendors ?? [];

            const storedFilters = localStorage.getItem('bookFilters');
            if (storedFilters) {
              this.filters = JSON.parse(storedFilters);
              localStorage.removeItem('bookFilters');
            }

            this.GetBookList();
          }
        });
      }
    });
  }

  GetBookList() {
    console.log(this.filters);
    this.homeService.BookGetList(this.filters).subscribe({
      next: (data: any) => {
        this.books = data.BooksList;
        this.totalRecords = data.TotalRecords;
        this.totalPages = data.totalPages;
      }
    });
  }

  resetFilters() {
    this.filters = new SearchFilters();
    this.GetBookList();
  }

  searchBooks() {
    this.GetBookList();
  }

  prevPage() {
    if (this.filters.PageNumber > 1) {
      this.filters.PageNumber--;
      this.GetBookList();
    }
  }

  nextPage() {
    this.filters.PageNumber++;
    this.GetBookList();
  }

  onClickPublication() {
    console.log("Selected Publications", this.filters.SelectedPublicationIds);
  }

  onClickDepartment() {
    console.log("Selected Departments:", this.filters.SelectedDepartmentId);
  }

  getSortArrow(column: string): string {
    if (this.filters.SortColumn === column) {
      return this.filters.SortDirection === 'ASC' ? '↑' : '↓';
    }
    return '';
  }

  sortData(column: string) {
    if (this.filters.SortColumn === column) {
      this.filters.SortDirection = this.filters.SortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.filters.SortColumn = column;
      this.filters.SortDirection = 'ASC';
    }
    this.GetBookList();
  }

  onEditBook(bookId: number) {
    console.log('Edit button clicked! Book ID:', bookId);
    console.log('Saving filters to localStorage:', this.filters);
    localStorage.setItem('bookFilters', JSON.stringify(this.filters));
    this.router.navigate(['/book/edit', bookId]);
  }

  onAddBook() {
    localStorage.setItem('/bookFilters', JSON.stringify(this.filters));
    this.router.navigate(['/book/add']);
  }

  openBookModal(book?: Book): void {
  this.selectedBook = new Book();

  if (book) {
    this.selectedBook = book;
    debugger;
    

    const deptMatch = this.departments.find(d => d.DepartmentName === book.DepartmentName);
    const pubMatch = this.vendors.find(v => v.PublicationName === book.PublicationName);
    console.log(deptMatch," ",pubMatch);

    this.selectedBook.DepartmentId = deptMatch?.DepartmentId || 0;
    this.selectedBook.PublicationId = pubMatch?.PublicationId || 0;
    console.log(this.selectedBook.DepartmentId+" "+this.selectedBook.PublicationId);
  }

  this.modalService.open(this.bookModal, { backdrop: 'static' });

  console.log('Modal opened with selectedBook:', this.selectedBook);
}

  deleteBook(bookId: number): void {
    debugger;
    console.log("deleteBook Component Method called!");
    console.log("BookId: ",bookId);
    this.homeService.deleteBook(bookId).subscribe({
    next: (response) => {
      // this.toastMessage = 'Book deleted successfully!';
      // this.showToast = true;
      this.toastService.show("Book Deleted Successfully");
      this.GetBookList(); 
    }
    
  });
}



confirmDelete(bookId: number): void {
  console.log("confirmDelete component method got called and id is ", bookId);

  Swal.fire({
    title: 'Delete this book?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    background: '#fff',
    iconColor: '#dc3545',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteBook(bookId);
      Swal.fire({
        title: 'Deleted!',
        text: 'The book has been deleted.',
        icon: 'success',
        confirmButtonColor: '#28a745'
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Cancelled',
        text: 'The book is safe 🙂',
        icon: 'info',
        confirmButtonColor: '#007bff'
      });
    }
  });
}




  saveBook(modalRef: NgbModalRef): void {
    this.homeService.saveBook(this.selectedBook).subscribe({
      next: () => {
        
        this.toastService.show("Book Saved Successfully");

        this.GetBookList();
        modalRef.close();
      }
    });
  }

  // toastMessage: string = '';
  // showToast: boolean = false;
  // toastType: string = 'bg-success text-white';
  onAddIssue(): void {
    this.router.navigate(['/add-issue']); 
  }


}
