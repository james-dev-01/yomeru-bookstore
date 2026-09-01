import { Component, Onlnit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { LivroService } from "../../core/livro";
import { Livro } from "../../models/livro.model";

@Component({
  selector: 'app-lista-livro',
  standalone: true,
  imports:[CommonModule,MatCardModule,MatButtonModule],
  templateUrl: './Lista-Livros.Component.html',
  styleUrls: ['./Lista-Livros.component.css']
})

export class ListaLivrosComponent implements Onlnit{
  Livros: Livro[] = [];
  private LivroService = inject (LivroService);

  ngOnInit(){
    this.Livros= this.LivroService.getLivros();
  
  }
}