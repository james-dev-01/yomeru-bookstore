import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, switchMap, catchError, of, from, concatMap, delay, toArray } from "rxjs";
import { Livro } from "../models/livro.model";
import { environment } from "../../environments/environment";
import { MEUS_LIVROS_ESCOLHIDOS } from "./vitrine-principal.data";

const SEPARADOR_AUTORES = ", ";
const TITULO_PADRAO = "Titulo Indisponivel";
const AUTOR_PADRAO = "Autor desconhecido";
const CATEGORIA_PADRAO = "Categoria desconhecida";
const SINOPSE_PADRAO = "Sinopse nao disponivel";

const DURACAO_CACHE_MS = 15 * 60 * 1000;
const INTERVALO_ENTRE_CHAMADAS_MS = 150;

@Injectable({
  providedIn: "root"
})
export class LivroService {
  private http = inject(HttpClient);
  livros = signal<Livro[]>([]);
  carregando = signal<boolean>(false);
  erro = signal<string | null>(null);

  tituloSecao = signal<string>('A Escolha do Editor');

  buscarVitrinePrincipal() {
    this.carregando.set(true);
    this.erro.set(null);
    this.tituloSecao.set('⭐ A Escolha do Editor');

    const CHAVE_CACHE = 'vitrine-principal';
    const cache = this.lerCache(CHAVE_CACHE);
    if (cache) {
      this.livros.set(cache);
      this.carregando.set(false);
      return;
    }

    from(MEUS_LIVROS_ESCOLHIDOS).pipe(
      concatMap(titulo => {
        const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${titulo}&maxResults=1&key=${environment.googleBooksApiKey}`;
        return this.http.get<any>(googleUrl).pipe(
          map(googleData => {
            if (googleData.items && googleData.items.length > 0) {
              return this.mapearLivro(googleData.items[0]);
            }
            return null;
          }),
          catchError((err) => {
            if (err.status === 429) {
              console.error('COTA DA API EXCEDIDA (429) ao buscar:', titulo);
            } else {
              console.error('Falhou ao buscar:', titulo, '- status:', err.status);
            }
            return of(null);
          }),
          delay(INTERVALO_ENTRE_CHAMADAS_MS)
        );
      }),
      toArray()
    ).subscribe({
      next: (resultados) => {
        const livrosEncontrados = resultados.filter(res => res !== null) as Livro[];
        this.livros.set(livrosEncontrados);
        if (livrosEncontrados.length > 0) {
          this.salvarCache(CHAVE_CACHE, livrosEncontrados);
        }
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error("Erro ao buscar a vitrine:", erro);
        this.erro.set("Não foi possível carregar a vitrine. Tente novamente.");
        this.carregando.set(false);
      }
    });
  }

  buscarBestSellers() {
    this.carregando.set(true);
    this.erro.set(null);
    this.tituloSecao.set('🏆 Mais Vendidos no Mundo (NYT)');

    const CHAVE_CACHE = 'best-sellers-nyt';
    const cache = this.lerCache(CHAVE_CACHE);
    if (cache) {
      this.livros.set(cache);
      this.carregando.set(false);
      return;
    }

    const nytUrl = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${environment.nytApiKey}`;

    this.http.get<any>(nytUrl).pipe(
      map(response => response.results.books.slice(0, 10)),
      switchMap((livrosNyt: any[]) => {
        if (!livrosNyt || livrosNyt.length === 0) return of([]);

        return from(livrosNyt).pipe(
          concatMap((livro: any) => {
            const isbn = livro.primary_isbn13;
            const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${environment.googleBooksApiKey}`;

            return this.http.get<any>(googleUrl).pipe(
              map(googleData => {
                if (googleData.items && googleData.items.length > 0) {
                  return this.mapearLivro(googleData.items[0]);
                }
                return null;
              }),
              catchError((err) => {
                console.error('Falhou ao buscar ISBN:', isbn, '- status:', err.status);
                return of(null);
              }),
              delay(INTERVALO_ENTRE_CHAMADAS_MS)
            );
          }),
          toArray()
        );
      }),
      map((resultados: any[]) => resultados.filter((res: any) => res !== null) as Livro[])
    ).subscribe({
      next: (livrosMapeados) => {
        this.livros.set(livrosMapeados);
        if (livrosMapeados.length > 0) {
          this.salvarCache(CHAVE_CACHE, livrosMapeados);
        }
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error("Erro ao buscar Best Sellers:", erro);
        this.erro.set("Não foi possível carregar os Best Sellers. Tente novamente.");
        this.carregando.set(false);
      }
    });
  }

  buscarLivrosDaApi(termoDeBusca: string = "subject:fantasy romance") {
    this.carregando.set(true);
    this.erro.set(null);

    if (termoDeBusca.startsWith('subject:')) {
      const categoria = termoDeBusca.replace('subject:', '');
      const mapaCategorias: { [key: string]: string } = {
        'fantasy': 'Fantasia', 'romance': 'Romance', 'fiction': 'Ficção', 'mystery': 'Mistério'
      };
      this.tituloSecao.set(`Explorando: ${mapaCategorias[categoria] || categoria}`);
    } else {
      this.tituloSecao.set(`Resultados para: "${termoDeBusca}"`);
    }

    const CHAVE_CACHE = 'busca:' + termoDeBusca.toLowerCase().trim();
    const cache = this.lerCache(CHAVE_CACHE);
    if (cache) {
      this.livros.set(cache);
      this.carregando.set(false);
      return;
    }

    const url = "https://www.googleapis.com/books/v1/volumes?q=" + termoDeBusca + "&maxResults=40&key=" + environment.googleBooksApiKey;

    this.http.get<any>(url).pipe(
      map(resposta => {
        if (!resposta.items) return [];
        return resposta.items.map((item: any) => this.mapearLivro(item));
      }),
      catchError((err) => {
        if (err.status === 429) {
          console.error('COTA DA API EXCEDIDA (429) ao buscar:', termoDeBusca);
        } else {
          console.error('Falhou ao buscar:', termoDeBusca, '- status:', err.status);
        }
        return of([]);
      })
    ).subscribe({
      next: (livrosMapeados) => {
        this.livros.set(livrosMapeados);
        if (livrosMapeados.length > 0) {
          this.salvarCache(CHAVE_CACHE, livrosMapeados);
        }
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

  private lerCache(chave: string): Livro[] | null {
    const bruto = sessionStorage.getItem(chave);
    if (!bruto) return null;

    try {
      const { dados, expiraEm } = JSON.parse(bruto);
      if (Date.now() > expiraEm) {
        sessionStorage.removeItem(chave);
        return null;
      }
      return dados;
    } catch {
      return null;
    }
  }

  private salvarCache(chave: string, dados: Livro[]) {
    sessionStorage.setItem(chave, JSON.stringify({
      dados,
      expiraEm: Date.now() + DURACAO_CACHE_MS
    }));
  }

  private gerarHash(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  private mapearLivro(item: any): Livro {
    const info = item.volumeInfo;
    const hash = this.gerarHash(item.id);
    const precoBase = 29.90 + (hash % 5001) / 100;
    const emPromocao = hash % 4 === 0;
    const precoFinal = emPromocao ? precoBase * 0.8 : precoBase;

    return {
      id: item.id,
      titulo: info.title || TITULO_PADRAO,
      autor: info.authors ? info.authors.join(SEPARADOR_AUTORES) : AUTOR_PADRAO,
      preco: precoFinal.toFixed(2),
      precoOriginal: emPromocao ? precoBase.toFixed(2) : undefined,
      emPromocao,
      capa: info.imageLinks?.thumbnail?.replace("http://", "https://") || "url-imagem-placeholder.jpg",
      categoria: info.categories ? info.categories[0] : CATEGORIA_PADRAO,
      sinopse: info.description || SINOPSE_PADRAO
    } as Livro;
  }
}