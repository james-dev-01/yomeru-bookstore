import{ inject, Injectable, computed, signal } from "@angular/core";
import { Livro } from "../../models/livro.model";
import { Pedido } from "../../models/pedido.model";

@Injectable({
  providedIn: "root"
})
export class CarrinhoService {
  itensCarrinho = signal<Livro[]>([]);
  ultimoPedido = signal<Pedido | null>(null);
  formaPagamento = signal<'credito' | 'debito' | 'pix' | null>(null);

   subtotal = computed(() => {
    return this.itensCarrinho().reduce((soma, livro) => soma + Number(livro.preco), 0);
  });

  frete = computed(() => {
    if (this.itensCarrinho().length === 0) return 0;

    return this.subtotal() >= 99.90 ? 0 : 12.90;
  });

  total = computed(() => {
    return this.subtotal() + this.frete();
  });

  valorParaFreteGratis = computed(() => {
    const falta = 99.90 - this.subtotal();
    return falta > 0 ? falta : 0;
  });

  adicionarAoCarrinho(livro: Livro) {
    this.itensCarrinho.update(itensAtuais => [...itensAtuais, livro]);
  }

  removerDoCarrinho(id: string) {
    this.itensCarrinho.update(itens => itens.filter(item => item.id !== id));
  }

  limparCarrinho() {
    this.itensCarrinho.set([]);
  }

  definirFormaPagamento(forma: 'credito' | 'debito' | 'pix') {
    this.formaPagamento.set(forma);
  }

  finalizarCompra(): Pedido {
    const forma = this.formaPagamento();

    if (!forma) {
      throw new Error('Não é possível finalizar a compra sem uma forma de pagamento selecionada.');
    }

    const pedido: Pedido = {
      numero: this.gerarNumeroPedido(),
      itens: this.itensCarrinho(),
      subtotal: this.subtotal(),
      frete: this.frete(),
      total: this.total(),
      data: new Date(),
      formaPagamento: forma,
    };

    this.ultimoPedido.set(pedido);
    this.limparCarrinho();
    this.formaPagamento.set(null);

    return pedido;
  }

  private gerarNumeroPedido(): string {
    return 'YM-' + Date.now().toString().slice(-8);
  }
}