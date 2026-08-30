import { settingsRepository } from '../repositories/settingsRepository';
import { StoreSettings } from '../../shared/types';

export const settingsService = {
  getSettings(): StoreSettings {
    return settingsRepository.getSettings();
  },

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    return settingsRepository.updateSettings(updates);
  }
};
