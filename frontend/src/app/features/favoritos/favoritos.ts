import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../core/services/favoritos.service';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  favoritosService = inject(FavoritosService);
  private carrinhoService = inject(CarrinhoService);

  removerFavorito(livroId: string) {
    this.favoritosService.removerFavorito(livroId);
  }

  adicionarNoCarrinho(livro: any) {
    this.carrinhoService.adicionarAoCarrinho(livro);
  }
}