import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCountComponent } from './input-count.component';

describe('InputCountComponent', () => {
  let component: InputCountComponent;
  let fixture: ComponentFixture<InputCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
