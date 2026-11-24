import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessoNegado } from './acesso-negado';

describe('AcessoNegado', () => {
  let component: AcessoNegado;
  let fixture: ComponentFixture<AcessoNegado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcessoNegado],
    }).compileComponents();

    fixture = TestBed.createComponent(AcessoNegado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
