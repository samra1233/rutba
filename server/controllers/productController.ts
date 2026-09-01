import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { persistProductImages } from '../services/firebaseStorageService';

export const productController = {
  getProducts(req: Request, res: Response) {
    try {
      const products = productService.getProducts(req.query);
      return res.json(products); // Backward-compatible response format
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch products', 500, 'FETCH_ERROR');
    }
  },

  getProductById(req: Request, res: Response) {
    try {
      const product = productService.getProductById(req.params.id);
      if (!product) {
        return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
      return res.json(product);
    } catch (err: any) {
      return sendError(res, err.message || 'Error retrieving product', 500, 'FETCH_ERROR');
    }
  },

  async createProduct(req: Request, res: Response) {
    try {
      const images = await persistProductImages(req.body.images);
      const product = productService.createProduct(images ? { ...req.body, images } : req.body);
      return res.status(201).json(product);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create product', 400, 'CREATE_ERROR');
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const images = await persistProductImages(req.body.images);
      const product = productService.updateProduct(req.params.id, images ? { ...req.body, images } : req.body);
      if (!product) {
        return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
      return res.json(product);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update product', 400, 'UPDATE_ERROR');
    }
  },

  deleteProduct(req: Request, res: Response) {
    try {
      const success = productService.deleteProduct(req.params.id);
      if (!success) {
        return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
      return res.json({ success: true });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete product', 400, 'DELETE_ERROR');
    }
  }
};
