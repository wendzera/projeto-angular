import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatTableModule, MatIconModule, MatTooltipModule, MatDialogModule, MatBadgeModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'description', 'price', 'actions'];
  supabaseService = inject(SupabaseService);
  cartService = inject(CartService);
  dialog = inject(MatDialog);
  router = inject(Router);

  ngOnInit() {
    this.supabaseService.loadProducts();
  }

  get products(): Product[] {
    return this.supabaseService.products();
  }

  openDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: { product: product ? { ...product } : { name: '', description: '', price: 0, imageUrl: '' } }
    });

    dialogRef.afterClosed().subscribe((result: Product) => {
      if (result) {
        if (product?.id) {
          this.supabaseService.updateProduct(product.id, result);
        } else {
          this.supabaseService.addProduct({
            ...result,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.supabaseService.deleteProduct(id);
    }
  }

  async addToCart(product: Product) {
    try {
      // Verifica se está logado
      if (!this.supabaseService.user()) {
        alert('Você precisa estar logado para adicionar produtos ao carrinho.');
        return;
      }
      
      await this.cartService.addToCart(product);
      alert('Produto adicionado ao carrinho com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      
      let mensagem = 'Erro ao adicionar produto ao carrinho.';
      
      if (error.message) {
        mensagem += '\nDetalhes: ' + error.message;
      }
      
      if (error.message?.includes('relation "order_items" does not exist')) {
        mensagem = 'A tabela do carrinho não foi criada ainda.\nPor favor, execute o script fix-cart-table.sql no Supabase.';
      } else if (error.message?.includes('not authenticated')) {
        mensagem = 'Você precisa estar logado para adicionar produtos ao carrinho.';
      } else if (error.message?.includes('permission denied') || error.message?.includes('policy')) {
        mensagem = 'Erro de permissão. Execute o script fix-cart-table.sql no Supabase para corrigir as políticas RLS.';
      }
      
      alert(mensagem);
    }
  }

  get cartItemCount(): number {
    return this.cartService.itemCount();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/60?text=Sem+Imagem';
  }
  
  async logout() {
    try {
      await this.supabaseService.logout();
      // O guard vai redirecionar automaticamente para o login
    } catch (error: any) {
      alert('Erro ao fazer logout: ' + error.message);
    }
  }
}
