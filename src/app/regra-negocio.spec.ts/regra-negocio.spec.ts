import { describe, it, expect } from 'vitest';

// Função que calcula desconto no livro
function aplicarDesconto(preco: number, temCupom: boolean): number {
  if (temCupom) {
    return preco - (preco * 0.10); // 10% de desconto
  }
  return preco;
}

describe('Testes Unitários - Lógica da Yomeru', () => {
  it('Deve aplicar 10% de desconto no livro se tiver cupom', () => {
    const resultado = aplicarDesconto(100, true);
    expect(resultado).toBe(90);
  });

  it('Deve manter o preço normal se não tiver cupom', () => {
    const resultado = aplicarDesconto(50, false);
    expect(resultado).toBe(50);
  });
});