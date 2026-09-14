import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  private carrinhoService = inject(CarrinhoService);
  private favoritosService = inject(FavoritosService);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);

  quantidadedeItens = computed(() => {
    return this.carrinhoService.itensCarrinho().length;
  });

  quantidadeFavoritos = computed(() => {
    return this.favoritosService.itensFavoritos().length;
  });

  // Converte o Observable da facade num Signal, pra usar
  // direto no HTML sem precisar de "async pipe"
  usuarioLogado = toSignal(this.authFacade.usuario$, { initialValue: null });

  sair(): void {
    this.authFacade.sair();
    this.router.navigate(['/login']);
  }
}