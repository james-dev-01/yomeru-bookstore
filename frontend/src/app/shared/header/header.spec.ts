import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { Livro } from '../../models/livro.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let carrinhoService: CarrinhoService;

  const livroTeste: Livro = {
    id: '1',
    titulo: 'Livro Teste',
    autor: 'Autor Teste',
    preco: '50.00',
    capa: 'capa.jpg',
    categoria: 'Fiction',
    sinopse: 'Sinopse teste'
  } as Livro;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    carrinhoService = TestBed.inject(CarrinhoService);
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com quantidade de itens zero', () => {
    expect(component.quantidadedeItens()).toBe(0);
  });

  it('deve atualizar a quantidade quando um item for adicionado ao carrinho', () => {
    carrinhoService.adicionarAoCarrinho(livroTeste);
    expect(component.quantidadedeItens()).toBe(1);
  });
});