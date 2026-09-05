import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  itens = this.carrinhoService.itensCarrinho;
  subtotal = this.carrinhoService.subtotal;
  frete = this.carrinhoService.frete;
  total = this.carrinhoService.total;
  valorFalta = this.carrinhoService.valorParaFreteGratis;

  removerItem(id: string | number) {
    this.carrinhoService.removerDoCarrinho(id);
  }

  finalizar() {
    alert('Compra finalizada!');
    this.carrinhoService.limparCarrinho();
  }
}