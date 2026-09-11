import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, switchMap, forkJoin, catchError, of } from "rxjs";
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

  tituloSecao = signal<string>('A Escolha do Editor'); 


  buscarVitrinePrincipal() {
    this.carregando.set(true);
    this.erro.set(null);
    // ATUALIZA O TÍTULO AQUI
    this.tituloSecao.set('⭐ A Escolha do Editor'); 

 const meusLivrosEscolhidos = [
      'intitle:"Entendendo Algoritmos"', 
      'intitle:"Solo Leveling vol 6"',
      'intitle:"Overgeared vol 1"', 
      'intitle:"Harry Potter e a Câmara Secreta"', 
      'intitle:"Vasco da Gama" esporte', 
      'intitle:"Senhor Dos Aneis" inauthor:"Tolkien"', 
      'intitle:"Rapido e Devagar" inauthor:"Kahneman"', 
      'intitle:"Tomb Raider King vol 1"',
      'intitle:"O Pequeno Principe"', 
      'intitle:"Komi Can\'t Communicate"',
      'intitle:"Overlord vol 1"',
      'intitle:"It Starts With One" "Linkin Park"',
      'intitle:"Tim" "Avicii"',
      'intitle:"Evanescence" "Evolution of Modern Gothic Rock"',
      'intitle:"Jujutsu Kaisen" inauthor:"Gege Akutami"', // AQUI: Trava de autor para bloquear os cadernos falsos!
      'intitle:"Naruto Gold, Vol. 1"',
      'intitle:"Dragon Ball Super, Vol. 24"',
      'intitle:"Bleach Remix" "13"',
      'intitle:"One Piece, Vol. 79"',
      'intitle:"Guerras Secretas" "Mundo Belico"'
    ];

    const requests = meusLivrosEscolhidos.map(titulo => {
      const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${titulo}&maxResults=1&key=${environment.googleBooksApiKey}`;
      return this.http.get<any>(googleUrl).pipe(
        map(googleData => {
          if (googleData.items && googleData.items.length > 0) {
            return this.mapearLivro(googleData.items[0]);
          }
          return null; 
        }),
        catchError(() => of(null)) 
      );
    });
    
    forkJoin(requests).subscribe({
      next: (resultados) => {
        const livrosEncontrados = resultados.filter(res => res !== null) as Livro[];
        this.livros.set(livrosEncontrados);
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
    // ATUALIZA O TÍTULO AQUI
    this.tituloSecao.set('🏆 Mais Vendidos no Mundo (NYT)');

    const nytUrl = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${environment.nytApiKey}`;

    this.http.get<any>(nytUrl).pipe(
      map(response => response.results.books.slice(0, 10)),
      switchMap((livrosNyt: any[]) => {
        if (!livrosNyt || livrosNyt.length === 0) return of([]);

        const googleRequests = livrosNyt.map((livro: any) => {
          const isbn = livro.primary_isbn13;
          const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${environment.googleBooksApiKey}`;
          
          return this.http.get<any>(googleUrl).pipe(
            map(googleData => {
              if (googleData.items && googleData.items.length > 0) {
                return this.mapearLivro(googleData.items[0]);
              }
              return null;
            }),
            catchError(() => of(null))
          );
        });
        
        return forkJoin(googleRequests) as Observable<any[]>;
      }),
      map((resultados: any[]) => resultados.filter((res: any) => res !== null) as Livro[])
    ).subscribe({
      next: (livrosMapeados) => {
        this.livros.set(livrosMapeados);
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

    const url = "https://www.googleapis.com/books/v1/volumes?q=" + termoDeBusca + "&maxResults=40&key=" + environment.googleBooksApiKey;

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