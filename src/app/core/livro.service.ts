import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Livro } from "../models/livro.model";
import { environment } from "../../environments/environment";

const SEPARADOR_AUTORES = ", ";
const TITULO_PADRAO = "Titulo Indisponivel";
const AUTOR_PADRAO = "Autor desconhecido";
const CATEGORIA_PADRAO = "Categoria desconhecida";
const SINOPSE_PADRAO = "Sinopse nao disponivel";

@Injectable({
  providedIn: "root"
})
export class LivroService {
  private http = inject(HttpClient);
  livros = signal<Livro[]>([]);
  carregando = signal<boolean>(false);
  erro = signal<string | null>(null);

  buscarLivrosDaApi(termoDeBusca: string = "subject:fantasy romance") {
    this.carregando.set(true);
    this.erro.set(null);

    const url = "https://www.googleapis.com/books/v1/volumes?q=" + termoDeBusca + "&key=" + environment.googleBooksApiKey;

    this.http.get<any>(url).pipe(
      map(resposta => {
        if (!resposta.items) return [];
        return resposta.items.map((item: any) => this.mapearLivro(item));
      })
    ).subscribe({
      next: (livrosMapeados) => {
        this.livros.set(livrosMapeados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error("Erro ao buscar livros da API:", erro);
        this.erro.set("Nao foi possivel carregar os livros. Tente novamente.");
        this.carregando.set(false);
      }
    });
  }

  buscarPorId(id: string): Observable<Livro> {
    const url = "https://www.googleapis.com/books/v1/volumes/" + id + "?key=" + environment.googleBooksApiKey;

    return this.http.get<any>(url).pipe(
      map(item => this.mapearLivro(item))
    );
  }

  private mapearLivro(item: any): Livro {
    const info = item.volumeInfo;
    const precoFicticio = (Math.random() * (79.90 - 29.90) + 29.90).toFixed(2);

    return {
      id: item.id,
      titulo: info.title || TITULO_PADRAO,
     autor: info.authors ? info.authors.join(SEPARADOR_AUTORES) : AUTOR_PADRAO,
      preco: precoFicticio,
      capa: info.imageLinks?.thumbnail?.replace("http://", "https://") || "url-imagem-placeholder.jpg",
      categoria: info.categories ? info.categories[0] : CATEGORIA_PADRAO,
      sinopse: info.description || SINOPSE_PADRAO
    } as Livro;
  }
}