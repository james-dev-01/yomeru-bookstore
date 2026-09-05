import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ListaLivrosComponent } from './lista-livros';

describe('ListaLivrosComponent', () => {
  let component: ListaLivrosComponent;
  let fixture: ComponentFixture<ListaLivrosComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaLivrosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaLivrosComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('googleapis.com')).flush({ items: [] });
    expect(component).toBeTruthy();
  });

  it('deve chamar buscarLivrosDaApi ao inicializar', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('googleapis.com'));
    expect(req.request.url).toContain('subject:fantasy romance');
    req.flush({ items: [] });
  });

  it('deve buscar pelo termo digitado ao chamar buscar()', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('googleapis.com')).flush({ items: [] });

    component.termoBusca.set('harry potter');
    component.buscar();

    const req = httpMock.expectOne(req => req.url.includes('harry'));
    expect(req.request.url).toContain('harry');
    req.flush({ items: [] });
  });

  it('deve filtrar por categoria usando prefixo subject:', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('googleapis.com')).flush({ items: [] });

    component.filtrarPorCategoria('horror');

    const req = httpMock.expectOne(req => req.url.includes('subject:horror'));
    expect(req.request.url).toContain('subject:horror');
    req.flush({ items: [] });
  });
});