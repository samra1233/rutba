import { db } from '../db';
import { Product } from '../../shared/types';

export const productRepository = {
  findAll(): Product[] {
    return db.getProducts();
  },

  findById(id: string): Product | undefined {
    return db.getProduct(id);
  },

  create(product: Product): Product {
    return db.createProduct(product);
  },

  update(id: string, updates: Partial<Product>): Product | undefined {
    return db.updateProduct(id, updates);
  },

  delete(id: string): boolean {
    return db.deleteProduct(id);
  }
};
