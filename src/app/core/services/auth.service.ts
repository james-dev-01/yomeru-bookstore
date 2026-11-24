import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface Usuario {
  nome: string;
  email: string;
  avatar: string;
  provider: 'google' | 'facebook';
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CHAVE_STORAGE = 'yomeru_usuario';

  private usuarioAtual$ = new BehaviorSubject<Usuario | null>(this.recuperarDoStorage());

  constructor() {}

  get usuario$(): Observable<Usuario | null> {
    return this.usuarioAtual$.asObservable();
  }

  loginComGoogle(): Observable<Usuario> {
    const usuarioFake: Usuario = {
      nome: 'Conta Google',
      email: 'usuario@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Conta+Google&background=00E676&color=0B0E14',
      provider: 'google',
      role: 'user'
    };

    return of(usuarioFake).pipe(
      delay(800),
      tap(usuario => this.definirUsuario(usuario))
    );
  }

  loginComFacebook(): Observable<Usuario> {
    const usuarioFake: Usuario = {
      nome: 'Conta Facebook',
      email: 'usuario@facebook.com',
      avatar: 'https://ui-avatars.com/api/?name=Conta+Facebook&background=1877F2&color=fff',
      provider: 'facebook',
      role: 'user'
    };

    return of(usuarioFake).pipe(
      delay(800),
      tap(usuario => this.definirUsuario(usuario))
    );
  }

  loginComoAdmin(): Observable<Usuario> {
    const usuarioAdmin: Usuario = {
      nome: 'Admin Yomeru',
      email: 'admin@yomeru.com',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff',
      provider: 'google',
      role: 'admin'
    };

    return of(usuarioAdmin).pipe(
      delay(500),
      tap(usuario => this.definirUsuario(usuario))
    );
  }

  private readonly EMAIL_ADMIN = 'yomeru.admin@gmail.com';
  private readonly SENHA_ADMIN = 'Eu$ouBatman1';

  loginComEmailSenha(email: string, senha: string): Observable<Usuario> {
    if (email.toLowerCase() === this.EMAIL_ADMIN && senha === this.SENHA_ADMIN) {
      return this.loginComoAdmin();
    }

    const usuarioFake: Usuario = {
      nome: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=00E676&color=0B0E14`,
      provider: 'google',
      role: 'user'
    };

    return of(usuarioFake).pipe(
      delay(800),
      tap(usuario => this.definirUsuario(usuario))
    );
  }

  logout(): void {
    localStorage.removeItem(this.CHAVE_STORAGE);
    this.usuarioAtual$.next(null);
  }

  estaLogado(): boolean {
    return this.usuarioAtual$.value !== null;
  }

  ehAdmin(): boolean {
    return this.usuarioAtual$.value?.role === 'admin';
  }

  getUsuarioAtual(): Usuario | null {
    return this.usuarioAtual$.value;
  }

  atualizarPerfil(dados: Partial<Pick<Usuario, 'nome' | 'avatar'>>): void {
    const atual = this.usuarioAtual$.value;
    if (!atual) return;

    const atualizado: Usuario = { ...atual, ...dados };
    this.definirUsuario(atualizado);
  }

  private definirUsuario(usuario: Usuario): void {
    localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(usuario));
    this.usuarioAtual$.next(usuario);
  }

  private recuperarDoStorage(): Usuario | null {
    const dados = localStorage.getItem(this.CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : null;
  }
}