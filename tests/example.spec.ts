import { test, expect } from '@playwright/test';

test('A página inicial deve carregar a vitrine e o título principal', async ({ page }) => {
  // O robô entra no seu localhost
  await page.goto('http://localhost:4200');

  // Verifica se o título do Yomeru está na tela
  const titulo = page.locator('h2');
  await expect(titulo).toContainText('A Escolha do Editor');

  // Verifica se a barra de busca carregou
  const inputBusca = page.locator('input[placeholder="Buscar por titulo ou assunto..."]');
  await expect(inputBusca).toBeVisible();
});