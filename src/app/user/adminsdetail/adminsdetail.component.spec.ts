import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsdetailComponent } from './adminsdetail.component';

describe('AdminsdetailComponent', () => {
  let component: AdminsdetailComponent;
  let fixture: ComponentFixture<AdminsdetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminsdetailComponent]
    });
    fixture = TestBed.createComponent(AdminsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
