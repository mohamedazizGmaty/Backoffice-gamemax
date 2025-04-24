import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanuserComponent } from './banuser.component';

describe('BanuserComponent', () => {
  let component: BanuserComponent;
  let fixture: ComponentFixture<BanuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BanuserComponent]
    });
    fixture = TestBed.createComponent(BanuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
