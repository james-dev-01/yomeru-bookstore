import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrinhoComponent } from './carrinho';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { Livro } from '../../models/livro.model';

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
    component.removerItem('1');
    expect(component.itens().length).toBe(0);
  });

  it('deve limpar o carrinho ao finalizar', () => {
    carrinhoService.adicionarAoCarrinho(livroTeste);

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.finalizar();

    expect(alertSpy).toHaveBeenCalledWith('Compra finalizada!');
    expect(component.itens().length).toBe(0);
  });
});