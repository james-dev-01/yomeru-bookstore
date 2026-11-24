import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NaoEncontrado } from './nao-encontrado';

describe('NaoEncontrado', () => {
  let component: NaoEncontrado;
  let fixture: ComponentFixture<NaoEncontrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoEncontrado],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NaoEncontrado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
