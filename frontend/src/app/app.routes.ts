import { Routes } from '@angular/router';
import { ListaLivrosComponent } from './features/livros/lista-livros/lista-livros';
import { CarrinhoComponent } from './features/compra/carrinho/carrinho'; // mudou
import { LivroDetalheComponent } from './features/livros/livro-detalhe/livro-detalhe';
import { Sobre } from './features/paginas/sobre/sobre';
import { PedidoConfirmado } from './features/compra/pedido-confirmado/pedido-confirmado'; // mudou
import { Admin } from './features/admin/admin';
import { AcessoNegado } from './features/paginas/acesso-negado/acesso-negado';
import { Login } from './features/conta/login/login';
import { Hero } from './features/home/hero/hero'; // mudou
import { Favoritos } from './features/livros/favoritos/favoritos';
import { Perfil } from './features/conta/perfil/perfil';
import { Pagamento } from './features/compra/pagamento/pagamento'; // mudou
import { NaoEncontrado } from './features/paginas/nao-encontrado/nao-encontrado';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', component: Hero },
  { path: 'catalogo', component: ListaLivrosComponent },
  { path: 'login', component: Login },
  { path: 'carrinho', component: CarrinhoComponent, canActivate: [authGuard] },
  { path: 'pagamento', component: Pagamento, canActivate: [authGuard] },
  { path: 'favoritos', component: Favoritos, canActivate: [authGuard] },
  { path: 'livro/:id', component: LivroDetalheComponent },
  { path: 'sobre', component: Sobre },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'pedido-confirmado', component: PedidoConfirmado, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'acesso-negado', component: AcessoNegado },
  { path: '**', component: NaoEncontrado }
];
