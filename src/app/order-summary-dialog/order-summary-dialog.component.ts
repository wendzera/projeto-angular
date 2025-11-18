import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartItem } from '../models/cart-item';

export interface OrderSummaryData {
  items: CartItem[];
  subtotal: number;
  freight: number;
  total: number;
  cep: string;
}

@Component({
  selector: 'app-order-summary-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule, 
    MatDialogModule, 
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './order-summary-dialog.component.html',
  styleUrls: ['./order-summary-dialog.component.css']
})
export class OrderSummaryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderSummaryData,
    private router: Router
  ) {}

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  formatCep(cep: string): string {
    if (cep.length === 8) {
      return `${cep.substring(0, 5)}-${cep.substring(5)}`;
    }
    return cep;
  }

  confirmOrder(): void {
    this.dialogRef.close('confirm');
  }

  cancelOrder(): void {
    this.dialogRef.close('cancel');
  }

  continueShopping(): void {
    this.dialogRef.close('continue');
    this.router.navigate(['/products']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/60?text=Sem+Imagem';
  }
}
