import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../booksmodels/book.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly baseUrl = 'http://localhost:62402/api';

  constructor(private http: HttpClient) {}

  // Books - list with filters
  BookGetList(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Books/BookGetList`, filters);
  }

  // Book Issue - complete details (uses your BookIssueController route)
  getCompleteBookIssueDetails(bookIssueId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/BookIssue/GetBookIssueDetails`, {
      params: { bookIssueId: String(bookIssueId) }
    });
  }

  // Master lists
  DepartmentGetList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Books/DepartmentGetList`);
  }

  PublicationsGetList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Books/PublicationsGetList`);
  }

  // Books - CRUD-ish
  GetBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/Books/GetBookById/${id}`);
  }

  saveBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/Books/SaveBook`, book);
  }

  // NOTE: Kept as GET to match your existing API; prefer DELETE if your backend supports it
  deleteBook(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Books/DeleteBook/${id}`);
  }
}
