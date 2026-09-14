import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaoEncontrado } from './nao-encontrado';

describe('NaoEncontrado', () => {
  let component: NaoEncontrado;
  let fixture: ComponentFixture<NaoEncontrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoEncontrado],
    }).compileComponents();

    fixture = TestBed.createComponent(NaoEncontrado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
