import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';

type FormaPagamento = 'credito' | 'debito' | 'pix';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagamento.html',
  styleUrls: ['./pagamento.css']
})
export class Pagamento implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  total = this.carrinhoService.total;
  formaSelecionada = signal<FormaPagamento | null>(null);

  ngOnInit() {
    if (this.carrinhoService.itensCarrinho().length === 0) {
      this.router.navigate(['/carrinho']);
    }
  }

  selecionar(forma: FormaPagamento) {
    this.formaSelecionada.set(forma);
  }

  confirmarPagamento() {
    const forma = this.formaSelecionada();
    if (!forma) return;

    this.carrinhoService.definirFormaPagamento(forma);
    this.carrinhoService.finalizarCompra();
    this.router.navigate(['/pedido-confirmado']);
  }
}