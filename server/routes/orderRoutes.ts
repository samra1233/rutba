import { Router } from 'express';
import { orderController } from '../controllers/orderController';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

export default router;
