import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './carrinho.component.html',
  
  styleUrls: ['./carrinho.css'] 
})
export class CarrinhoComponent {
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  itens = this.carrinhoService.itensCarrinho;
  subtotal = this.carrinhoService.subtotal;
  frete = this.carrinhoService.frete;
  total = this.carrinhoService.total;
  valorFalta = this.carrinhoService.valorParaFreteGratis;

  removerItem(index: number) {
    this.carrinhoService.removerDoCarrinho(index);
  }

  finalizar() {
    this.carrinhoService.finalizarCompra();
    this.router.navigate(['/pedido-confirmado']);
  }
}