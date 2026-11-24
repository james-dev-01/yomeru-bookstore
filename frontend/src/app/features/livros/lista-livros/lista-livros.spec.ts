import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ListaLivrosComponent } from './lista-livros';

describe('ListaLivrosComponent', () => {
  let component: ListaLivrosComponent;
  let fixture: ComponentFixture<ListaLivrosComponent>;
  let httpMock: HttpTestingController;

  const ehGoogleBooks = (req: { url: string }) => req.url.includes('googleapis.com');

  // A vitrine faz varias buscas de uma vez; esta funcao responde todas com lista vazia
  function responderTudo() {
    const pedidos = httpMock.match(ehGoogleBooks);
    pedidos.forEach(p => p.flush({ items: [] }));
    return pedidos;
  }

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ListaLivrosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
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
    responderTudo();
    expect(component).toBeTruthy();
  });

  it('deve buscar a vitrine na API ao inicializar', () => {
    fixture.detectChanges();
    const pedidos = responderTudo();
    expect(pedidos.length).toBeGreaterThan(0);
  });

  it('deve buscar pelo termo digitado ao chamar buscar()', () => {
    fixture.detectChanges();
    responderTudo();

    component.termoBusca.set('harry potter');
    component.buscar();

    const req = httpMock.expectOne(r => r.url.includes('harry'));
    expect(req.request.url).toContain('harry');
    req.flush({ items: [] });
  });

  it('deve filtrar por categoria usando prefixo subject:', () => {
    fixture.detectChanges();
    responderTudo();

    component.filtrarPorCategoria('horror');

    const req = httpMock.expectOne(r => r.url.includes('subject:horror'));
    expect(req.request.url).toContain('subject:horror');
    req.flush({ items: [] });
  });
});
