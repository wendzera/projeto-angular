import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  
  const user = supabase.user();
  
  if (user) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};