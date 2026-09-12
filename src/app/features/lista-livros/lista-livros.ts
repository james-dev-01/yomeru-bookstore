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
    
    this.livroService.buscarVitrinePrincipal();
  }

  buscar() {
    const termo = this.termoBusca().trim();
    if (termo) {
      this.livroService.buscarLivrosDaApi(termo);
    } else {
   
      this.livroService.buscarVitrinePrincipal();
    }
  }

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