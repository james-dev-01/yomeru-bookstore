import { Livro } from './livro.model';

export interface Pedido {
  numero: string;
  itens: Livro[];
  subtotal: number;
  frete: number;
  total: number;
  data: Date;
  formaPagamento: 'credito' | 'debito' | 'pix';
}