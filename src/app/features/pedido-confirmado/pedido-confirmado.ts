import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedido-confirmado.html',
  styleUrl: './pedido-confirmado.css',
})
export class PedidoConfirmado {
  private carrinhoService = inject(CarrinhoService);

  pedido = this.carrinhoService.ultimoPedido;
}