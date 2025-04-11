import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPacksComponent } from './all-packs.component';

describe('AllPacksComponent', () => {
  let component: AllPacksComponent;
  let fixture: ComponentFixture<AllPacksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPacksComponent]
    });
    fixture = TestBed.createComponent(AllPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
