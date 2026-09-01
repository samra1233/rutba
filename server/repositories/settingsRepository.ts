import { db } from '../db';
import { StoreSettings, SupportedCountry } from '../../shared/types';

export const DEFAULT_SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: 'PK', name: 'Pakistan', currency: 'PKR', enabled: true },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', enabled: true },
  { code: 'US', name: 'United States', currency: 'USD', enabled: true },
  { code: 'GB', name: 'Scotland / UK', currency: 'GBP', enabled: true },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', enabled: true },
  { code: 'AU', name: 'Australia', currency: 'AUD', enabled: true },
  { code: 'SG', name: 'Singapore', currency: 'SGD', enabled: true },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', enabled: true },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', enabled: true },
];

export const settingsRepository = {
  getSettings(): StoreSettings {
    const raw = db.getSettings();
    return {
      brandName: 'RUBTA',
      baseCurrency: 'PKR',
      defaultCountry: 'AE',
      supportedCountries: DEFAULT_SUPPORTED_COUNTRIES,
      supportedCurrencies: ['PKR', 'USD', 'AED', 'SAR', 'AUD', 'SGD', 'HKD', 'MYR', 'GBP'],
      shippingCountries: ['Pakistan', 'United States', 'Saudi Arabia', 'United Arab Emirates', 'Australia', 'Singapore', 'Hong Kong', 'Malaysia', 'Scotland / UK'],
      supportEmail: 'care@rubta.com',
      supportPhone: '+92 300 123 4567',
      orderPrefix: 'ORD',
      shippingFee: 15,
      cardShippingFee: 15,
      codShippingFee: 25,
      freeShippingThreshold: 500,
      ...raw
    };
  },

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    const updated = db.updateSettings(updates);
    return {
      brandName: 'RUBTA',
      baseCurrency: 'PKR',
      defaultCountry: 'AE',
      supportedCountries: DEFAULT_SUPPORTED_COUNTRIES,
      supportedCurrencies: ['PKR', 'USD', 'AED', 'SAR', 'AUD', 'SGD', 'HKD', 'MYR', 'GBP'],
      shippingCountries: ['Pakistan', 'United States', 'Saudi Arabia', 'United Arab Emirates', 'Australia', 'Singapore', 'Hong Kong', 'Malaysia', 'Scotland / UK'],
      supportEmail: 'care@rubta.com',
      supportPhone: '+92 300 123 4567',
      orderPrefix: 'ORD',
      shippingFee: 15,
      cardShippingFee: 15,
      codShippingFee: 25,
      freeShippingThreshold: 500,
      ...updated
    };
  }
};
