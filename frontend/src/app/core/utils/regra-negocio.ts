// Calcula o preço final do livro: 10% de desconto se tiver cupom
export function aplicarDesconto(preco: number, temCupom: boolean): number {
  if (temCupom) {
    return preco - preco * 0.1;
  }
  return preco;
}
