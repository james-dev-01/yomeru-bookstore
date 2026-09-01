import { Injectable } from "@angular/core";
import { Livro } from "../models/livro.model";

@Injectable({
  providedln: 'root'
})
export class LivroService{
  private Livros: Livro[] = [
    {
      id: 1,
      titulo: ' O Senhor dos Anéis',
      autor: 'J.R.R. tolkien',
      preco: 59,90
      capa:'https://m.media-amazon.com/images/I/715eWT30O6L._SY342_.jpg',
      categoria:'fantasia',
      sinopse:'Um anel para a todos governar.'
   },
{
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      preco: 39,90
      capa:'https://m.media-amazon.com/images/I/71kXa1lJSMX._SY342_.jpg'',
      categoria:'Ficção Cientifica',
      sinopse:'Grande Irmão está de olho em você.'
   },
{
      id: 3,
      titulo: 'Dom Quixote',
      autor: 'Miguel de Cervantes',
      preco: 45,00
      capa:'https://m.media-amazon.com/images/I/715eWT30O6L._SY342_.jpg',
      categoria:'Clássico',
      sinopse:'As aventuras do fidalgo sonhador.'
   }
  ];
  getLivros():Livro[]{
    return this.Livros;
  }
  }
