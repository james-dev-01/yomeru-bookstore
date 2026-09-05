import{ inject, Injectable, computed, signal } from "@angular/core";
import { Livro } from "../../models/livro.model";

@Injectable({
  providedIn: "root"
})
export class CarrinhoService {
  itensCarrinho = signal<Livro[]>([]);
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

  removerDoCarrinho(livroId: string | number) {
  this.itensCarrinho.update(itens => itens.filter(item => item.id !== livroId));

  }

  limparCarrinho() {
    this.itensCarrinho.set([]);
  }
} 