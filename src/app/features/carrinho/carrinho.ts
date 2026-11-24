import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CarrinhoService } from '../../core/services/carrinho.service';

interface EnderecoViaCep {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.css']
})
export class CarrinhoComponent {
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);
  private http = inject(HttpClient);

  itens = this.carrinhoService.itensCarrinho;
  subtotal = this.carrinhoService.subtotal;
  frete = this.carrinhoService.frete;
  total = this.carrinhoService.total;
  valorFalta = this.carrinhoService.valorParaFreteGratis;

  cep = signal('');
  buscandoCep = signal(false);
  endereco = signal<{ logradouro: string; bairro: string; cidade: string; uf: string; prazo: string } | null>(null);
  cepInvalido = signal(false);

  removerItem(index: number) {
    this.carrinhoService.removerDoCarrinho(index);
  }

  onCepChange(valorDigitado: string) {
    const digitos = valorDigitado.replace(/\D/g, '').slice(0, 8);
    const formatado = digitos.length > 5
      ? `${digitos.slice(0, 5)}-${digitos.slice(5)}`
      : digitos;

    this.cep.set(formatado);
    this.endereco.set(null);
    this.cepInvalido.set(false);

    if (digitos.length === 8) {
      this.buscarEndereco(digitos);
    }
  }

  private buscarEndereco(digitos: string) {
    this.buscandoCep.set(true);

    this.http.get<EnderecoViaCep>(`https://viacep.com.br/ws/${digitos}/json/`).subscribe({
      next: (dados) => {
        this.buscandoCep.set(false);

        if (dados.erro) {
          this.cepInvalido.set(true);
          return;
        }

        this.endereco.set({
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          uf: dados.uf,
          prazo: this.calcularPrazoEntrega(dados.uf)
        });
      },
      error: () => {
        this.buscandoCep.set(false);
        this.cepInvalido.set(true);
      }
    });
  }

  // Estimativa fictícia de prazo, baseada na região do CEP
  private calcularPrazoEntrega(uf: string): string {
    const sudeste = ['SP', 'RJ', 'MG', 'ES'];
    const sul = ['PR', 'SC', 'RS'];

    if (sudeste.includes(uf)) return '2 a 4 dias úteis';
    if (sul.includes(uf)) return '3 a 6 dias úteis';
    return '5 a 10 dias úteis';
  }

  finalizar() {
    this.router.navigate(['/pagamento']);
  }
}