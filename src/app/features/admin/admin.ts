import { Component, signal } from '@angular/core';

interface LivroVendas {
  titulo: string;
  autor: string;
  vendas: number;
  faturamento: number;
  corCapa: string;
}

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  // Dados fictícios — apenas para fins de demonstração/apresentação
  faturamentoTotal = signal(8247650.90);
  totalPedidos = signal(15342);
  totalUsuarios = signal(9871);
  ticketMedio = signal(537.60);

  livrosMaisVendidos = signal<LivroVendas[]>([
    { titulo: 'Solo Leveling, Vol. 6', autor: 'Chugong', vendas: 3241, faturamento: 129640, corCapa: '6366F1' },
    { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', vendas: 2987, faturamento: 119480, corCapa: '00E676' },
    { titulo: 'Entendendo Algoritmos', autor: 'Aditya Y. Bhargava', vendas: 2654, faturamento: 92890, corCapa: '1877F2' },
  ]);

  livrosMenosVendidos = signal<LivroVendas[]>([
    { titulo: 'Vasco Da Gama', autor: 'Heron Lima', vendas: 12, faturamento: 480, corCapa: '94A3B8' },
    { titulo: 'Verity', autor: 'Colleen Hoover', vendas: 18, faturamento: 900, corCapa: 'F87171' },
    { titulo: 'Felipe Neto', autor: 'Nelson Lima Neto', vendas: 23, faturamento: 690, corCapa: 'FBBF24' },
  ]);

  gerarUrlCapa(titulo: string, cor: string): string {
    const tituloCurto = titulo.length > 20 ? titulo.substring(0, 20) + '...' : titulo;
    return `https://placehold.co/72x104/${cor}/0B0E14?text=${encodeURIComponent(tituloCurto)}&font=poppins`;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}