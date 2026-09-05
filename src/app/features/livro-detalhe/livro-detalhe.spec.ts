import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LivroDetalheComponent } from './livro-detalhe';

describe('LivroDetalheComponent', () => {
  let component: LivroDetalheComponent;
  let fixture: ComponentFixture<LivroDetalheComponent>;
  let httpMock: HttpTestingController;

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: (chave: string) => 'id-teste-123'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroDetalheComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LivroDetalheComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado e buscar o livro pelo id da rota', () => {
    const req = httpMock.expectOne(req => req.url.includes('id-teste-123'));
    req.flush({
      id: 'id-teste-123',
      volumeInfo: {
        title: 'Livro da Rota',
        authors: ['Autor da Rota'],
        categories: ['Drama'],
        description: 'Sinopse da rota',
        imageLinks: { thumbnail: 'http://exemplo.com/capa.jpg' }
      }
    });

    expect(component).toBeTruthy();
    expect(component.livro()?.titulo).toBe('Livro da Rota');
    expect(component.carregando()).toBe(false);
  });

  it('deve setar erro quando a busca por id falhar', () => {
    const req = httpMock.expectOne(req => req.url.includes('id-teste-123'));
    req.flush('Erro', { status: 500, statusText: 'Server Error' });

    expect(component.erro()).toBe('Não foi possível carregar os detalhes deste livro.');
    expect(component.carregando()).toBe(false);
  });

  it('deve adicionar o livro ao carrinho e mostrar confirmacao temporaria', async () => {
    const req = httpMock.expectOne(req => req.url.includes('id-teste-123'));
    req.flush({
      id: 'id-teste-123',
      volumeInfo: { title: 'Livro X', authors: ['Autor X'] }
    });

    component.adicionarNoCarrinho();
    expect(component.adicionado()).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 2100));
    expect(component.adicionado()).toBe(false);
  }, 3000);
});