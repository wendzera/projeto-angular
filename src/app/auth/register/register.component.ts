import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onRegister() {
    this.errorMessage = '';

    // Validações
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, insira um email válido';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.loading = true;
    try {
      const user = await this.supabase.register(this.email.trim().toLowerCase(), this.password);
      console.log('Registro bem-sucedido:', user);
      
      // Sucesso! Redireciona para o login
      alert('Cadastro realizado com sucesso! Você já pode fazer login.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      // Tratamento de erros específicos do Supabase
      let errorMsg = 'Erro ao fazer cadastro!';
      
      console.error('Erro completo:', err);
      console.error('Mensagem:', err.message);
      console.error('Status:', err.status);
      
      if (err.message) {
        if (err.message.includes('User already registered') || 
            err.message.includes('already registered') || 
            err.message.includes('já existe')) {
          errorMsg = 'Este email já está cadastrado. Tente fazer login.';
        } else if (err.message.includes('invalid') || 
                   err.message.includes('inválido') ||
                   err.message.includes('Invalid')) {
          errorMsg = 'Email inválido. Use um email real (ex: usuario@gmail.com)';
        } else if (err.message.includes('rate limit') || 
                   err.message.includes('too many')) {
          errorMsg = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMsg = 'Email precisa ser confirmado. Verifique sua caixa de entrada.';
        } else if (err.message.includes('Unable to validate email')) {
          errorMsg = 'Não foi possível validar o email. Verifique as configurações do Supabase.';
        } else {
          errorMsg = 'Erro: ' + err.message;
        }
      }
      
      this.errorMessage = errorMsg;
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
