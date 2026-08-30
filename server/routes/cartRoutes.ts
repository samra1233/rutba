import { Router } from 'express';
import { cartController } from '../controllers/cartController';

const router = Router();

router.get('/:userId', cartController.getCart);
router.post('/:userId', cartController.updateCart);

export default router;
