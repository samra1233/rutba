import { Request, Response } from 'express';
import { settingsService } from '../services/settingsService';
import { sendError } from '../utils/responseFormatter';

export const settingsController = {
  getSettings(req: Request, res: Response) {
    try {
      const settings = settingsService.getSettings();
      return res.json(settings);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch settings', 500, 'SETTINGS_ERROR');
    }
  },

  updateSettings(req: Request, res: Response) {
    try {
      const settings = settingsService.updateSettings(req.body);
      return res.json(settings);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update settings', 400, 'UPDATE_SETTINGS_ERROR');
    }
  }
};
