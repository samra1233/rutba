import { db } from '../db';
import { InventoryTransaction, InventoryTransactionType } from '../../shared/types';

const inventoryTransactions: InventoryTransaction[] = [];

export const inventoryRepository = {
  recordTransaction(payload: {
    productId: string;
    variantId?: string;
    type: InventoryTransactionType;
    quantityChange: number;
    previousStock: number;
    newStock: number;
    referenceId?: string;
    reason?: string;
    adminId?: string;
  }): InventoryTransaction {
    const transaction: InventoryTransaction = {
      id: `inv_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...payload,
      createdAt: new Date().toISOString()
    };
    inventoryTransactions.push(transaction);

    // Save transaction to Firestore as audit record
    try {
      db.writeFirestoreDoc('inventory_transactions', transaction.id, transaction);
    } catch (_) {}

    return transaction;
  },

  getTransactionsByProduct(productId: string): InventoryTransaction[] {
    return inventoryTransactions.filter(t => t.productId === productId);
  },

  getAllTransactions(): InventoryTransaction[] {
    return inventoryTransactions;
  }
};
