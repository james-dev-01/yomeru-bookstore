import { Component, inject, OnInit, signal } from '@angular/core';
import { LivroService } from '../../core/livro.service';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-lista-livros',
  standalone: true,
  templateUrl: './lista-livros.html',
  styleUrl: './lista-livros.css',
})
export class ListaLivrosComponent implements OnInit {
  livroService = inject(LivroService);
  private carrinhoService = inject(CarrinhoService);

  termoBusca = signal<string>('');

  ngOnInit() {
    this.livroService.buscarLivrosDaApi();
  }

  buscar() {
    const termo = this.termoBusca().trim();
    if (termo) {
      this.livroService.buscarLivrosDaApi(termo);
    } else {
      this.livroService.buscarLivrosDaApi();
    }
  }

  filtrarPorCategoria(categoria: string) {
    this.livroService.buscarLivrosDaApi('subject:' + categoria);
  }

  adicionarNoCarrinho(livro: any) {
    this.carrinhoService.adicionarAoCarrinho(livro);
  }
}