import { Routes } from '@angular/router';
import { ListaLivrosComponent } from './features/lista-livros/lista-livros';
import { CarrinhoComponent } from './features/carrinho/carrinho';
import { LivroDetalheComponent } from './features/livro-detalhe/livro-detalhe';
import { Sobre } from './features/sobre/sobre';
import { PedidoConfirmado } from './features/pedido-confirmado/pedido-confirmado';
import { Admin } from './features/admin/admin';
import { AcessoNegado } from './features/acesso-negado/acesso-negado';
import { Login } from './features/login/login';
import { authGuard } from './core/auth-guard';
import { adminGuard } from './core/admin-guard';

export const routes: Routes = [
  { path: '', component: ListaLivrosComponent },
  { path: 'login', component: Login },
  { path: 'carrinho', component: CarrinhoComponent, canActivate: [authGuard] },
  { path: 'livro/:id', component: LivroDetalheComponent },
  { path: 'sobre', component: Sobre },
  { path: 'pedido-confirmado', component: PedidoConfirmado, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'acesso-negado', component: AcessoNegado }
];