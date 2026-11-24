import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CarrinhoComponent } from './carrinho';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { Livro } from '../../../models/livro.model';

describe('CarrinhoComponent', () => {
  let component: CarrinhoComponent;
  let fixture: ComponentFixture<CarrinhoComponent>;
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
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CarrinhoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoComponent);
    component = fixture.componentInstance;
    carrinhoService = TestBed.inject(CarrinhoService);
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve refletir os itens do carrinho do service', () => {
    carrinhoService.adicionarAoCarrinho(livroTeste);
    expect(component.itens().length).toBe(1);
  });

  it('deve remover item ao chamar removerItem', () => {
    carrinhoService.adicionarAoCarrinho(livroTeste);
    component.removerItem(0);
    expect(component.itens().length).toBe(0);
  });

  it('deve ir para a tela de pagamento ao finalizar', () => {
    const router = TestBed.inject(Router);
    const navegarSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.finalizar();

    expect(navegarSpy).toHaveBeenCalledWith(['/pagamento']);
  });
});
