import { Routes } from '@angular/router';
import { ListaLivrosComponent } from './features/lista-livros/lista-livros';
import { CarrinhoComponent } from './features/carrinho/carrinho'; 
import { LivroDetalheComponent } from './features/livro-detalhe/livro-detalhe';
import { Sobre } from './features/sobre/sobre'; 
import { PedidoConfirmado } from './features/pedido-confirmado/pedido-confirmado';

export const routes: Routes = [
  { path: '', component: ListaLivrosComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'livro/:id', component: LivroDetalheComponent },
  { path: 'sobre', component: Sobre },
  { path: 'pedido-confirmado', component: PedidoConfirmado }
];