import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsGameComponent } from './assets-game.component';

describe('AssetsGameComponent', () => {
  let component: AssetsGameComponent;
  let fixture: ComponentFixture<AssetsGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetsGameComponent]
    });
    fixture = TestBed.createComponent(AssetsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
