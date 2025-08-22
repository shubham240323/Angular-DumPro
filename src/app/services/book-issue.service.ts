
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookIssueModel } from '../models/book-issue-model';
import { SupportFile } from '../models/support-file.model';

@Injectable({ providedIn: 'root' })
export class BookIssueService {
  private baseUrl = 'http://localhost:62402/api/BookIssue';
  private filesBase = 'http://localhost:62402/api/BookIssueFiles';

  constructor(private http: HttpClient) {}


  saveIssueWithFiles(model: BookIssueModel, files: File[]): Observable<any> {
  const form = new FormData();
  form.append('model', JSON.stringify(model)); 
  for (const f of files) form.append('files', f, f.name);

  return this.http.post<any>(`${this.baseUrl}/Save`, form); 
  }
  
  getAllIssueIds() {
    return this.http.get<{ BookIssueID: number }[]>(`${this.baseUrl}/GetAllBookIssueIds`);
  }

  getIssueDetailsById(issueId: number) {
    return this.http.get<any>(`${this.baseUrl}/GetBookIssueDetails`, { params: { bookIssueId: String(issueId) } });
  }

  getUsers() {
    return this.http.get<{ UserID: number; UserName: string }[]>(`${this.baseUrl}/GetUsersList`);
  }

  getBooks() {
    return this.http.get<{ BookID: number; BookName: string }[]>(`${this.baseUrl}/GetBooksList`);
  }


  getSupportFiles(bookIssueId: number) {
    return this.http.get<SupportFile[]>(`${this.filesBase}/list`, { params: { bookIssueId: String(bookIssueId) } });
  }

  deleteSupportFile(fileId: number) {
    return this.http.delete(`${this.filesBase}/${fileId}`);
  }

  downloadUrl(fileId: number) {
    return `${this.filesBase}/download/${fileId}`;
  }
}

// export interface SupportFile {
//   FileID: number;
//   BookIssueID: number;
//   FileName: string;
//   FilePath?: string;
//   UploadedBy?: number;
//   UploadedOn?: string;
//   IsActive?: boolean;
// }
