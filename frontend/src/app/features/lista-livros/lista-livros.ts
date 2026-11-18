import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { LivroService } from '../../core/livro.service';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { Livro } from '../../models/livro.model';

@Component({
  selector: 'app-lista-livros',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './lista-livros.html',
  styleUrl: './lista-livros.css',
})
export class ListaLivrosComponent implements OnInit {
  livroService = inject(LivroService);
  favoritosService = inject(FavoritosService);
  private carrinhoService = inject(CarrinhoService);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);

  termoBusca = signal<string>('');

  ngOnInit() {
    this.livroService.buscarVitrinePrincipal();
  }

  buscar() {
    const termo = this.termoBusca().trim();
    if (termo) {
      this.livroService.buscarLivrosDaApi(termo);
    } else {
      this.livroService.buscarVitrinePrincipal();
    }
  }

  carregarBestSellers() {
    this.livroService.buscarBestSellers();
  }

  filtrarPorCategoria(categoria: string) {
    this.livroService.buscarLivrosDaApi('subject:' + categoria);
  }

  adicionarNoCarrinho(livro: Livro) {
    if (!this.authFacade.usuarioEstaLogado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carrinhoService.adicionarAoCarrinho(livro);
  }

  alternarFavorito(livro: Livro) {
    if (!this.authFacade.usuarioEstaLogado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.favoritosService.alternarFavorito(livro);
  }
}