import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}
  
  features = [
    {
      icon: 'inventory_2',
      title: 'Gerenciar Produtos',
      description: 'Adicione, edite e exclua produtos do seu catálogo',
      route: '/products'
    }
  ];
  
  async logout() {
    try {
      await this.supabase.logout();
      // O guard vai redirecionar automaticamente para o login
    } catch (error: any) {
      alert('Erro ao fazer logout: ' + error.message);
    }
  }
}
