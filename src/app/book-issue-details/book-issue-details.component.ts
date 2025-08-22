import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BookIssueService } from '../services/book-issue.service';
import { BookIssueModel } from '../models/book-issue-model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { SupportFile } from '../models/support-file.model';

type BookSlim = { BookID: number; BookName: string };

@Component({
  selector: 'app-book-issue-details',
  standalone: false,
  templateUrl: './book-issue-details.component.html',
})
export class BookIssueDetailsComponent implements OnInit {
  issueIds: any[] = [];
  selectedIssueId: number | null = null;
  users: { UserID: number; UserName: string }[] = [];
  issueDetails: any = null;
  isSaving = false;

  private ymd = (d?: any) => (d ? new Date(d).toISOString().slice(0, 10) : '');
  private today = () => new Date().toISOString().slice(0, 10);


  booksMaster: BookSlim[] = [];
  visibleBooks: BookSlim[] = [];
  bookSelections: { [id: number]: boolean } = {};
  bookSearch = '';
  allVisibleSelected = false;
  private modalRef?: NgbModalRef;


  supportFiles: SupportFile[] = [];
  pendingFiles: File[] = [];
  uploading = false;
  uploadProgress = -1;


  private searchInput = new Subject<string>();

  constructor(
    private bookIssueService: BookIssueService,
    private router: Router,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadIssueIds();
    this.loadUsers();
    this.issueDetails = this.getEmptyIssue();
    this.searchInput.pipe(debounceTime(200), distinctUntilChanged()).subscribe(() => this.recomputeVisibleBooks());
  }


  loadIssueIds(): void {
    this.bookIssueService.getAllIssueIds().subscribe({
      next: (data) => (this.issueIds = data || []),
    });
  }

  loadUsers(): void {
    this.bookIssueService.getUsers().subscribe({
      next: (data) => (this.users = data || []),
    });
  }

  loadBooks(): void {
    this.bookIssueService.getBooks().subscribe({
      next: (data) => {
        this.booksMaster = data || [];
        this.recomputeVisibleBooks();
      },
    });
  }

  private loadSupportFiles(): void {
    const id = this.currentIssueId();
    if (!id) {
      this.supportFiles = [];
      return;
    }
    this.bookIssueService.getSupportFiles(id).subscribe({
      next: (files) => (this.supportFiles = files || []),
      error: () => (this.supportFiles = []),
    });
  }


  onIssueIdChange(): void {
    if (this.selectedIssueId != null) {
      this.bookIssueService.getIssueDetailsById(this.selectedIssueId).subscribe({
        next: (data) => {
          const m = data || this.getEmptyIssue();
          m.UserID = m.User?.UserID ?? m.UserID ?? null;
          m.IssueDate = this.ymd(m.IssueDate);
          m.DueDate = this.ymd(m.DueDate);
          m.DeletedDetailIds = [];
          this.issueDetails = m;
          this.loadSupportFiles();
        },
      });
    } else {
      this.issueDetails = this.getEmptyIssue();
      this.supportFiles = [];
    }
  }

  startNewIssue(): void {
    this.selectedIssueId = null;
    this.issueDetails = this.getEmptyIssue();
    this.supportFiles = [];
    this.pendingFiles=[];
    

  }

  private getEmptyIssue() {
    const t = this.today();
    return {
      BookIssueID: 0,
      UserID: null,
      User: { UserID: null, UserName: '' },
      IssueDate: t,
      DueDate: t,
      CreatedOn: null,
      BookIssueDetails: [] as Array<{
        BookIssueDetailID?: number;
        BookID?: number;
        BookName?: string;
        Quantity: number;
      }>,
      DeletedDetailIds: [] as number[],
    };
  }

  cancel(): void {
    this.router.navigate(['/Home']);
  }

  openBookPicker(tpl: TemplateRef<any>): void {
    if (!this.booksMaster.length) this.loadBooks();
    else this.recomputeVisibleBooks();

    this.bookSelections = {};
    (this.issueDetails?.BookIssueDetails || []).forEach((d: any) => {
      if (d.BookID != null) this.bookSelections[d.BookID] = true;
    });

    this.bookSearch = '';
    this.allVisibleSelected = false;
    this.modalRef = this.modal.open(tpl, { size: 'lg', backdrop: 'static' });
  }

  onSearchChange(term: string): void {
    this.bookSearch = term || '';
    this.searchInput.next(this.bookSearch);
  }

  onSelectionToggle(book: BookSlim, checked: boolean): void {
    this.bookSelections[book.BookID] = checked;
    this.recomputeVisibleBooks();
  }

  toggleAllVisible(): void {
    const next = !this.allVisibleSelected;
    for (const b of this.visibleBooks) {
      if (!this.isAlreadyAdded(b.BookID)) this.bookSelections[b.BookID] = next;
    }
    this.allVisibleSelected = next;
    this.recomputeVisibleBooks();
  }

  private recomputeVisibleBooks(): void {
    const q = (this.bookSearch || '').trim().toLowerCase();
    const filtered = (this.booksMaster || []).filter((b) => !q || (b.BookName ?? '').toLowerCase().includes(q));
    this.visibleBooks = filtered;

    const selectable = this.visibleBooks.filter((b) => !this.isAlreadyAdded(b.BookID));
    this.allVisibleSelected = selectable.length > 0 && selectable.every((b) => !!this.bookSelections[b.BookID]);
  }

  isAlreadyAdded(id: number): boolean {
    return (this.issueDetails?.BookIssueDetails || []).some((d: any) => d.BookID === id);
  }

  addSelectedBooks(modal: NgbModalRef): void {
    if (!this.issueDetails) { modal.dismiss(); return; }

    const selectedIds = Object.keys(this.bookSelections).filter((k) => this.bookSelections[+k]).map(Number);
    if (!selectedIds.length) { modal.dismiss(); return; }

    const existing = new Set<number>((this.issueDetails.BookIssueDetails || []).map((d: any) => d.BookID));
    for (const b of this.booksMaster || []) {
      if (selectedIds.includes(b.BookID) && !existing.has(b.BookID)) {
        this.issueDetails.BookIssueDetails.push({ BookID: b.BookID, BookName: b.BookName, Quantity: 1 });
      }
    }
    modal.close();
  }

  removeBook(index: number): void {
    if (!this.issueDetails?.BookIssueDetails) return;
    const row = this.issueDetails.BookIssueDetails[index];

    if (row?.BookIssueDetailID) {
      this.issueDetails.DeletedDetailIds ??= [];
      this.issueDetails.DeletedDetailIds.push(row.BookIssueDetailID);
    }

    this.issueDetails.BookIssueDetails.splice(index, 1);
    if (row?.BookID != null) this.bookSelections[row.BookID] = false;
    this.recomputeVisibleBooks();
  }

  
  onFilesSelected(evt: Event): void {
  const input = evt.target as HTMLInputElement;
  const picked = Array.from(input.files ?? []);
  if (picked.length === 0) return;

  for (const f of picked) {
    this.pendingFiles.push(f);
  }

  input.value = '';
  this.uploadProgress = -1;
}

  removePendingFile(index: number): void {
    if (index < 0 || index >= this.pendingFiles.length) return;
    this.pendingFiles.splice(index, 1);
  }


  updateIssue(form: NgForm): void {
    if (!this.issueDetails || form.invalid || !this.issueDetails.UserID || !(this.issueDetails.BookIssueDetails?.length)) {
      alert('Please complete all fields and add at least one book.');
      return;
    }

   

    const payload: BookIssueModel = {
      BookIssueID: this.issueDetails.BookIssueID || 0,
      UserID: this.issueDetails.UserID,
      IssueDate: this.issueDetails.IssueDate,
      DueDate: this.issueDetails.DueDate,
      CreatedBy: this.issueDetails.BookIssueID ? undefined : 6,
      ModifiedBy: this.issueDetails.BookIssueID ? 6 : undefined,
      Books: (this.issueDetails.BookIssueDetails || [])
        .filter((d: any) => d.BookID)
        .map((d: any) => ({ BookID: d.BookID, Quantity: d.Quantity || 1 })),  
      DeletedDetailIds: this.issueDetails.DeletedDetailIds || [],
    };
    debugger;
    console.log("hello");
    console.log(BookIssueModel);
    console.log(this.issueDetails.BookIssueDetails);

    this.isSaving = true;
    this.uploading = true;
    

    this.bookIssueService.saveIssueWithFiles(payload, this.pendingFiles).subscribe({
      next: (event) => {
        alert('Saved successfully with documents!');
          this.pendingFiles = [];
          this.uploading = false;
          this.isSaving = false;
          this.onIssueIdChange();
          this.loadIssueIds();
          this.loadSupportFiles();
        
      },
      error: (err) => {
        console.error('Save failed', err);
        alert('Save failed');
        this.uploading = false;
        this.isSaving = false;
        
      },
    });
  }

  currentIssueId(): number | null {
    return this.selectedIssueId ?? (this.issueDetails?.BookIssueID || null);
  }

  downloadUrl(fileId: number): string {
    return this.bookIssueService.downloadUrl(fileId);
  }

  deleteFile(f: SupportFile): void {
    if (!f?.FileID) return;
    if (!confirm(`Delete file "${f.FileName}"?`)) return;

    this.bookIssueService.deleteSupportFile(f.FileID).subscribe({
      next: () => this.supportFiles = this.supportFiles.filter((x) => x.FileID !== f.FileID),
      error: (err) => console.error('Delete failed', err),
    });
  }
}
