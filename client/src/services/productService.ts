import { apiFetch } from './api';
import { Product } from '../../../shared/types';

export const productService = {
  async getProducts(params?: Record<string, string>): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) query.append(key, val);
      });
    }
    const queryString = query.toString();
    return apiFetch<Product[]>(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  async getProductById(id: string): Promise<Product> {
    return apiFetch<Product>(`/api/products/${id}`);
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return apiFetch<Product>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return apiFetch<Product>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
  }
};
