import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item';
import { OrderSummaryDialogComponent } from '../order-summary-dialog/order-summary-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);
  dialog = inject(MatDialog);
  cep: string = '';

  get items(): CartItem[] {
    return this.cartService.items();
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get freight(): number {
    return this.cartService.freight();
  }

  get total(): number {
    return this.cartService.total();
  }

  get hasCep(): boolean {
    return this.cartService.getCep().length > 0;
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  increment(productId: number): void {
    this.cartService.incrementQuantity(productId);
  }

  decrement(productId: number): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: number): void {
    if (confirm('Deseja remover este item do carrinho?')) {
      this.cartService.removeItem(productId);
    }
  }

  onCepChange(): void {
    this.cartService.setCep(this.cep);
  }

  formatCep(cep: string): string {
    // Format: 12345-678
    if (cep.length === 8) {
      return `${cep.substring(0, 5)}-${cep.substring(5)}`;
    }
    return cep;
  }

  openOrderSummary(): void {
    if (!this.hasCep) {
      alert('Por favor, informe o CEP para calcular o frete.');
      return;
    }

    if (this.items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const dialogRef = this.dialog.open(OrderSummaryDialogComponent, {
      width: '600px',
      data: {
        items: this.items,
        subtotal: this.subtotal,
        freight: this.freight,
        total: this.total,
        cep: this.cartService.getCep()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.finalizeOrder();
      } else if (result === 'continue') {
        // User wants to continue shopping
        // Navigation will be handled in the dialog
      }
      // If 'cancel', do nothing
    });
  }

  finalizeOrder(): void {
    // Here you would typically send the order to a backend/database
    alert('Pedido finalizado com sucesso! Total: ' + this.total.toFixed(2));
    this.cartService.clearCart();
    this.cep = '';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/100?text=Sem+Imagem';
  }
}
