import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Livro } from '../../models/livro.model';
import { LivroService } from '../../core/livro.service';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-livro-detalhe',
  standalone: true,
  templateUrl: './livro-detalhe.html',
  styleUrl: './livro-detalhe.css',
})
export class LivroDetalheComponent {
  private route = inject(ActivatedRoute);
  private livroService = inject(LivroService);
  private carrinhoService = inject(CarrinhoService);

  livro = signal<Livro | null>(null);
  carregando = signal<boolean>(true);
  erro = signal<string | null>(null);
  adicionado = signal<boolean>(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.livroService.buscarPorId(id).subscribe({
      next: (l: Livro) => {
        this.livro.set(l);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os detalhes deste livro.');
        this.carregando.set(false);
      }
    });
  }

  adicionarNoCarrinho() {
    const l = this.livro();
    if (l) {
      this.carrinhoService.adicionarAoCarrinho(l);
      this.adicionado.set(true);
      setTimeout(() => this.adicionado.set(false), 2000);
    }
  }
}