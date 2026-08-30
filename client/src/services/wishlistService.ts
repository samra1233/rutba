const WISHLIST_KEY = 'rubta_wishlist';

export const wishlistService = {
  getWishlist(): string[] {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  },

  saveWishlist(items: string[]): void {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    } catch (_) {}
  },

  toggleWishlistItem(productId: string): string[] {
    const current = this.getWishlist();
    const exists = current.includes(productId);
    const updated = exists ? current.filter(id => id !== productId) : [...current, productId];
    this.saveWishlist(updated);
    return updated;
  }
};
