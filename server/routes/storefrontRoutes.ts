import { Router } from 'express';
import { locationService } from '../services/locationService';
import { sendSuccess, sendError } from '../utils/responseFormatter';

const router = Router();

router.get('/location', async (req, res) => {
  try {
    const locationData = await locationService.detectLocation(req);
    return sendSuccess(res, locationData);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to detect location', 500, 'LOCATION_ERROR');
  }
});

export default router;
