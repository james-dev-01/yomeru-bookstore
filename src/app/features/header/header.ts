import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import  { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  
})
export class HeaderComponent {
  private carrinhoService = inject(CarrinhoService);

  quantidadedeItens = computed(() => {
    return this.carrinhoService.itensCarrinho().length;
});
}