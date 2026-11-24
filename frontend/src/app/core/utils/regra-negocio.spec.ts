import { describe, it, expect } from 'vitest';
import { aplicarDesconto } from './regra-negocio';

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
