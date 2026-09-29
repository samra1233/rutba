import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { validateOrderPayload } from '../utils/validation';
import { sendError } from '../utils/responseFormatter';

const router = Router();

const validateCreateOrder: (req: any, res: any, next: any) => void = (req, res, next) => {
  const errors = validateOrderPayload(req.body);
  if (errors.length > 0) {
    return sendError(res, errors.join(', '), 400, 'VALIDATION_ERROR');
  }
  next();
};

router.post('/', validateCreateOrder, orderController.createOrder);
router.post('/clear-all', orderController.clearAllOrders);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

export default router;
