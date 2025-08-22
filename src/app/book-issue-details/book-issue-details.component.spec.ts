import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueDetailsComponent } from './book-issue-details.component';

describe('BookIssueDetailsComponent', () => {
  let component: BookIssueDetailsComponent;
  let fixture: ComponentFixture<BookIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookIssueDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
