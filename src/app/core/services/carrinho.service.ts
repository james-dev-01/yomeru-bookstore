import{ inject, Injectable, computed, signal } from "@angular/core";
import { Livro } from "../../models/livro.model";
import { Pedido } from "../../models/pedido.model";

@Injectable({
  providedIn: "root"
})
export class CarrinhoService {
  itensCarrinho = signal<Livro[]>([]);
  ultimoPedido = signal<Pedido | null>(null);

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

  removerDoCarrinho(index: number) {
    this.itensCarrinho.update(itens => itens.filter((_, i) => i !== index));
  }

  limparCarrinho() {
    this.itensCarrinho.set([]);
  }

  finalizarCompra(): Pedido {
    const pedido: Pedido = {
      numero: this.gerarNumeroPedido(),
      itens: this.itensCarrinho(),
      subtotal: this.subtotal(),
      frete: this.frete(),
      total: this.total(),
      data: new Date(),
    };

    this.ultimoPedido.set(pedido);
    this.limparCarrinho();

    return pedido;
  }

  private gerarNumeroPedido(): string {
    return 'YM-' + Date.now().toString().slice(-8);
  }
}