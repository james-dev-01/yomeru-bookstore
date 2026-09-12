import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, Usuario } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {

  constructor(private authService: AuthService) {}

  get usuario$(): Observable<Usuario | null> {
    return this.authService.usuario$;
  }

  entrarComGoogle(): Observable<Usuario> {
    return this.authService.loginComGoogle();
  }

  entrarComFacebook(): Observable<Usuario> {
    return this.authService.loginComFacebook();
  }

  entrarComoAdmin(): Observable<Usuario> {
    return this.authService.loginComoAdmin();
  }

  entrarComEmailSenha(email: string, senha: string): Observable<Usuario> {
    return this.authService.loginComEmailSenha(email, senha);
  }

  sair(): void {
    this.authService.logout();
  }

  usuarioEstaLogado(): boolean {
    return this.authService.estaLogado();
  }

  usuarioEhAdmin(): boolean {
    return this.authService.ehAdmin();
  }

  obterUsuarioLogado(): Usuario | null {
    return this.authService.getUsuarioAtual();
  }
}