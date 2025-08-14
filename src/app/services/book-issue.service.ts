import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookIssueModel, BookIssueDetailRow } from '../models/book-issue-model';


@Injectable({ providedIn: 'root' })
export class BookIssueService {
  private baseUrl = 'http://localhost:62402/api/BookIssue';

  constructor(private http: HttpClient) {}

  getAllIssueIds(): Observable<{ BookIssueID: number }[]> {
    return this.http.get<{ BookIssueID: number }[]>(`${this.baseUrl}/GetAllBookIssueIds`);
  }

  getIssueDetailsById(issueId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetBookIssueDetails?bookIssueId=${issueId}`);
  }

  getUsers(): Observable<{ UserID: number; UserName: string }[]> {
    return this.http.get<{ UserID: number; UserName: string }[]>(`${this.baseUrl}/GetUsersList`);
  }

  getBooks(): Observable<{ BookID: number; BookName: string }[]> {
    return this.http.get<{ BookID: number; BookName: string }[]>(`${this.baseUrl}/GetBooksList`);
  }

  saveIssue(model: BookIssueModel): Observable<{ BookIssueID: number }> {
    return this.http.post<{ BookIssueID: number }>(`${this.baseUrl}/Save`, model);
  }


}

//    getSupportFiles(bookIssueId: number): Observable<SupportFile[]> {
//     debugger;
//     console.log("inside getSuppostFiles");
//     return this.http.get<SupportFile[]>(`${this.baseUrl}/list?bookIssueId=${bookIssueId}`);
//   }


//   uploadSupportFiles(bookIssueId: number, files: File[], uploadedBy: number)
//     : Observable<HttpEvent<any>> {
//     const form = new FormData();
//     // Use same key "files" for all files to match controller
//     for (const f of files) form.append('files', f, f.name);

//     const req = new HttpRequest(
//       'POST',
//       `${this.baseUrl}/upload?bookIssueId=${bookIssueId}&uploadedBy=${uploadedBy}`,
//       form,
//       { reportProgress: true }
//     );
//     return this.http.request(req);
//   }


//   deleteSupportFile(fileId: number, modifiedBy: number) {
//     return this.http.delete(`${this.baseUrl}/${fileId}?modifiedBy=${modifiedBy}`);
//   }
// }

// export interface SupportFile {
//   FileID?: number;
//   BookIssueID?: number;
//   FileName: string;
//   FilePath: string;
//   UploadedBy?: number;
//   UploadedOn?: string;
//   IsActive?: boolean;
// }

