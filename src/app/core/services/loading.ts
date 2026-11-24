import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private contador = signal(0);
  carregando = signal(false);

  iniciar() {
    this.contador.update(n => n + 1);
    this.carregando.set(true);
  }

  finalizar() {
    this.contador.update(n => Math.max(0, n - 1));
    this.carregando.set(this.contador() > 0);
  }
}