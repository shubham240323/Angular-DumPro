import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertBookComponent } from './upsert-book.component';

describe('BookUpsertComponent', () => {
  let component: UpsertBookComponent;
  let fixture: ComponentFixture<UpsertBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
