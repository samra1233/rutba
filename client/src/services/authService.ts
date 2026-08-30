import { apiFetch } from './api';

export interface AdminUser {
  id: string;
  email: string;
}

export const authService = {
  async loginAdmin(credentials: { email: string; password?: string; bypassPasswordCheck?: boolean }): Promise<{ success: boolean; admin: AdminUser }> {
    return apiFetch<{ success: boolean; admin: AdminUser }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async logoutAdmin(): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>('/api/admin/logout', {
      method: 'POST'
    });
  },

  async checkAdminAuth(): Promise<{ admin: AdminUser }> {
    return apiFetch<{ admin: AdminUser }>('/api/admin/me');
  }
};
