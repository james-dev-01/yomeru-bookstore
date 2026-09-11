import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { LivroService } from '../../core/livro.service';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-lista-livros',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './lista-livros.html',
  styleUrl: './lista-livros.css',
})
export class ListaLivrosComponent implements OnInit {
  livroService = inject(LivroService);
  private carrinhoService = inject(CarrinhoService);

  termoBusca = signal<string>('');

  ngOnInit() {
    // Carrega a SUA vitrine assim que a tela abre!
    this.livroService.buscarVitrinePrincipal();
  }

  buscar() {
    const termo = this.termoBusca().trim();
    if (termo) {
      this.livroService.buscarLivrosDaApi(termo);
    } else {
      // Se a pessoa limpar a busca, volta pra sua vitrine
      this.livroService.buscarVitrinePrincipal();
    }
  }

  // Nova função para o botão do New York Times
  carregarBestSellers() {
    this.livroService.buscarBestSellers();
  }

  filtrarPorCategoria(categoria: string) {
    this.livroService.buscarLivrosDaApi('subject:' + categoria);
  }

  adicionarNoCarrinho(livro: any) {
    this.carrinhoService.adicionarAoCarrinho(livro);
  }
}