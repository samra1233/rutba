import { inventoryRepository } from '../repositories/inventoryRepository';
import { productRepository } from '../repositories/productRepository';
import { InventoryTransaction, InventoryTransactionType } from '../../shared/types';

export const inventoryService = {
  adjustStock(payload: {
    productId: string;
    quantityChange: number;
    type: InventoryTransactionType;
    referenceId?: string;
    reason?: string;
    adminId?: string;
  }): { product?: any; transaction?: InventoryTransaction; error?: string } {
    const product = productRepository.findById(payload.productId);
    if (!product) {
      return { error: `Product ${payload.productId} not found` };
    }

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + payload.quantityChange);

    if (payload.quantityChange < 0 && previousStock < Math.abs(payload.quantityChange)) {
      return { error: `Insufficient stock for ${product.name}. Available: ${previousStock}` };
    }

    productRepository.update(product.id, { stock: newStock });

    const transaction = inventoryRepository.recordTransaction({
      productId: product.id,
      type: payload.type,
      quantityChange: payload.quantityChange,
      previousStock,
      newStock,
      referenceId: payload.referenceId,
      reason: payload.reason,
      adminId: payload.adminId
    });

    return { product, transaction };
  },

  getProductTransactions(productId: string): InventoryTransaction[] {
    return inventoryRepository.getTransactionsByProduct(productId);
  },

  getAllTransactions(): InventoryTransaction[] {
    return inventoryRepository.getAllTransactions();
  }
};
