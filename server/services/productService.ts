import { productRepository } from '../repositories/productRepository';
import { Product } from '../../shared/types';

export const productService = {
  getProducts(queryFilters?: any): Product[] {
    let products = productRepository.findAll();

    if (!queryFilters) return products;

    const { fabric, type, collection, search, sort, color, sizes, season, sale, bestSeller, category, pieces, newArrival, minPrice, maxPrice } = queryFilters;

    if (search) {
      const term = String(search).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.collection && p.collection.toLowerCase().includes(term))
      );
    }

    if (fabric) {
      products = products.filter(p => p.fabric && p.fabric.toLowerCase() === String(fabric).toLowerCase());
    }

    if (type) {
      products = products.filter(p => p.type && p.type.toLowerCase() === String(type).toLowerCase());
    }

    if (collection) {
      products = products.filter(p => p.collection && p.collection.toLowerCase() === String(collection).toLowerCase());
    }

    if (color) {
      products = products.filter(p => p.colors && p.colors.some(c => c.toLowerCase().includes(String(color).toLowerCase())));
    }

    if (sizes) {
      products = products.filter(p => p.sizes && p.sizes.some(s => s.toLowerCase() === String(sizes).toLowerCase()));
    }

    if (season) {
      products = products.filter(p => p.season && p.season.toLowerCase() === String(season).toLowerCase());
    }

    if (sale === 'true') {
      products = products.filter(p => p.onSale);
    }

    if (bestSeller === 'true') {
      products = products.filter(p => p.isBestSeller);
    }

    if (newArrival === 'true') {
      products = products.filter(p => p.isNewArrival);
    }

    if (category) {
      const catTarget = String(category).trim().toLowerCase();
      products = products.filter(p => {
        if (!p.category) return false;
        const pCat = p.category.trim().toLowerCase();
        if (pCat === catTarget) return true;
        // Aliases for Ready to Wear / Stitches / Stitched
        const readyAliases = ['ready to wear', 'stitches', 'stitched', 'pret-a-porter'];
        if (readyAliases.includes(catTarget) && readyAliases.includes(pCat)) return true;
        // Aliases for Party Wear
        const partyAliases = ['party wear', 'partywear', 'festive glam', 'party'];
        if (partyAliases.includes(catTarget) && partyAliases.includes(pCat)) return true;
        return false;
      });
    }

    if (pieces) {
      products = products.filter(p => p.pieces && p.pieces.toLowerCase() === String(pieces).toLowerCase());
    }

    const parsedMinPrice = minPrice === undefined || minPrice === '' ? undefined : Number(minPrice);
    const parsedMaxPrice = maxPrice === undefined || maxPrice === '' ? undefined : Number(maxPrice);
    if (parsedMinPrice !== undefined && Number.isFinite(parsedMinPrice)) {
      products = products.filter(p => (p.onSale && p.salePrice ? p.salePrice : p.price) >= parsedMinPrice);
    }
    if (parsedMaxPrice !== undefined && Number.isFinite(parsedMaxPrice)) {
      products = products.filter(p => (p.onSale && p.salePrice ? p.salePrice : p.price) <= parsedMaxPrice);
    }

    if (sort) {
      const sortBy = String(sort);
      if (sortBy === 'price-asc') {
        products = [...products].sort((a, b) => {
          const pA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const pB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return pA - pB;
        });
      } else if (sortBy === 'price-desc') {
        products = [...products].sort((a, b) => {
          const pA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const pB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return pB - pA;
        });
      } else if (sortBy === 'name-asc') {
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return products;
  },

  getProductById(id: string): Product | undefined {
    return productRepository.findById(id);
  },

  createProduct(data: Partial<Product>): Product {
    const newProduct: Product = {
      id: data.id || `ms-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'New Product',
      price: Number(data.price) || 0,
      basePrice: Number(data.price) || 0,
      fabric: data.fabric || 'Lawn',
      type: data.type || 'Embroidered',
      collection: data.collection || 'General',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'],
      description: data.description || '',
      stock: isNaN(Number(data.stock)) ? 10 : Number(data.stock),
      colors: Array.isArray(data.colors) ? data.colors : ['Multicolor'],
      viewers: 0,
      isNewArrival: true,
      features: Array.isArray(data.features) ? data.features : []
    };

    return productRepository.create(newProduct);
  },

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    return productRepository.update(id, updates);
  },

  deleteProduct(id: string): boolean {
    return productRepository.delete(id);
  }
};
