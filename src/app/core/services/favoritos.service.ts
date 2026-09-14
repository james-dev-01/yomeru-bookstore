import { Injectable, signal, computed } from "@angular/core";
import { Livro } from "../../models/livro.model";

@Injectable({
  providedIn: "root"
})
export class FavoritosService {
  itensFavoritos = signal<Livro[]>([]);

  totalFavoritos = computed(() => this.itensFavoritos().length);

  ehFavorito(livroId: string): boolean {
    return this.itensFavoritos().some(livro => livro.id === livroId);
  }

  alternarFavorito(livro: Livro) {
    if (this.ehFavorito(livro.id)) {
      this.removerFavorito(livro.id);
    } else {
      this.adicionarFavorito(livro);
    }
  }

  adicionarFavorito(livro: Livro) {
    this.itensFavoritos.update(itens => [...itens, livro]);
  }

  removerFavorito(livroId: string) {
    this.itensFavoritos.update(itens => itens.filter(l => l.id !== livroId));
  }

  limparFavoritos() {
    this.itensFavoritos.set([]);
  }
}