import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelproomComponent } from './helproom.component';

describe('HelproomComponent', () => {
  let component: HelproomComponent;
  let fixture: ComponentFixture<HelproomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelproomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelproomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
