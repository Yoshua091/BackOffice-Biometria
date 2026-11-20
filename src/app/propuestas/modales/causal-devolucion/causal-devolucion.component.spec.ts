import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausalDevolucionComponent } from './causal-devolucion.component';

describe('CausalDevolucionComponent', () => {
  let component: CausalDevolucionComponent;
  let fixture: ComponentFixture<CausalDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CausalDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CausalDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
