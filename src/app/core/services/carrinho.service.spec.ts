import { TestBed } from '@angular/core/testing';
import { CarrinhoService } from './carrinho.service';
import { Livro } from '../../models/livro.model';

describe('CarrinhoService', () => {
  let service: CarrinhoService;

  const livroTeste: Livro = {
    id: '1',
    titulo: 'Livro Teste',
    autor: 'Autor Teste',
    preco: '50.00',
    capa: 'capa.jpg',
    categoria: 'Fiction',
    sinopse: 'Sinopse teste'
  } as Livro;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrinhoService);
  });

  it('deve ser criado com carrinho vazio', () => {
    expect(service).toBeTruthy();
    expect(service.itensCarrinho().length).toBe(0);
  });

  it('deve adicionar um livro ao carrinho', () => {
    service.adicionarAoCarrinho(livroTeste);
    expect(service.itensCarrinho().length).toBe(1);
    expect(service.subtotal()).toBe(50);
  });

  it('deve remover um livro do carrinho', () => {
    service.adicionarAoCarrinho(livroTeste);
    service.removerDoCarrinho('1');
    expect(service.itensCarrinho().length).toBe(0);
  });

  it('deve calcular frete gratis acima de 99.90', () => {
    service.adicionarAoCarrinho({ ...livroTeste, preco: '100.00' } as Livro);
    expect(service.frete()).toBe(0);
  });

  it('deve cobrar frete de 12.90 abaixo de 99.90', () => {
    service.adicionarAoCarrinho(livroTeste);
    expect(service.frete()).toBe(12.90);
  });

  it('deve calcular o total como subtotal mais frete', () => {
    service.adicionarAoCarrinho(livroTeste);
    expect(service.total()).toBe(50 + 12.90);
  });

  it('deve calcular quanto falta para frete gratis', () => {
    service.adicionarAoCarrinho(livroTeste);
    expect(service.valorParaFreteGratis()).toBe(99.90 - 50);
  });

  it('deve limpar o carrinho', () => {
    service.adicionarAoCarrinho(livroTeste);
    service.limparCarrinho();
    expect(service.itensCarrinho().length).toBe(0);
  });
});