import { Router } from 'express';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import collectionRoutes from './collectionRoutes';
import orderRoutes from './orderRoutes';
import cartRoutes from './cartRoutes';
import adminRoutes from './adminRoutes';
import settingsRoutes from './settingsRoutes';
import storefrontRoutes from './storefrontRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/collections', collectionRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/storefront', storefrontRoutes);

export default router;
