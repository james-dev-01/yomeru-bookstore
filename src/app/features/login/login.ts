import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  carregando = false;
  provedorCarregando: 'google' | 'facebook' | 'admin' | 'email' | null = null;
  formLogin: FormGroup;

  // Controla se a senha aparece como texto ou como pontinhos
  senhaVisivel = signal(false);

  // Controla o modal de aviso (substitui o alert() do navegador)
  modalAberto = signal(false);
  mensagemModal = signal('');

  private readonly REGEX_SENHA_FORTE = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.pattern(this.REGEX_SENHA_FORTE)]]
    });
  }

  get email() {
    return this.formLogin.get('email');
  }

  get senha() {
    return this.formLogin.get('senha');
  }

  alternarVisibilidadeSenha(): void {
    this.senhaVisivel.set(!this.senhaVisivel());
  }

  entrarComEmailSenha(): void {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.provedorCarregando = 'email';

    const { email, senha } = this.formLogin.value;

    this.authFacade.entrarComEmailSenha(email, senha).subscribe(() => {
      this.carregando = false;
      this.router.navigate(['/']);
    });
  }

  entrarComGoogle(): void {
    this.carregando = true;
    this.provedorCarregando = 'google';

    this.authFacade.entrarComGoogle().subscribe(() => {
      this.carregando = false;
      this.router.navigate(['/']);
    });
  }

  entrarComFacebook(): void {
    this.carregando = true;
    this.provedorCarregando = 'facebook';

    this.authFacade.entrarComFacebook().subscribe(() => {
      this.carregando = false;
      this.router.navigate(['/']);
    });
  }

  entrarComoAdmin(): void {
    this.carregando = true;
    this.provedorCarregando = 'admin';

    this.authFacade.entrarComoAdmin().subscribe(() => {
      this.carregando = false;
      this.router.navigate(['/admin']);
    });
  }

  esqueceuSenha(): void {
    this.mensagemModal.set(
      'Este recurso é meramente ilustrativo, criado para fins de apresentação. Em um sistema real, aqui enviaríamos um email de recuperação de senha.'
    );
    this.modalAberto.set(true);
  }

  criarConta(): void {
    this.mensagemModal.set(
      'Este recurso é meramente ilustrativo, criado para fins de apresentação. Em um sistema real, aqui abriríamos a tela de cadastro.'
    );
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
  }
}