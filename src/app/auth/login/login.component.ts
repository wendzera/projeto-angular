import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onLogin() {
    this.loading = true;
    try {
      await this.supabase.login(this.email, this.password);
      this.router.navigate(['/home']); // redireciona para Home
    } catch (err: any) {
      alert(err.message || 'Erro ao fazer login!');
    } finally {
      this.loading = false;
    }
  }
}