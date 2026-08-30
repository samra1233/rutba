import { Request } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';
import { StorefrontLocationData, SupportedCountry } from '../../shared/types';

export const locationService = {
  async detectLocation(req: Request): Promise<StorefrontLocationData> {
    const settings = settingsRepository.getSettings();
    const supportedCountries = settings.supportedCountries || [];
    const defaultCountryCode = settings.defaultCountry || 'AE';

    // Find configured default country match
    const defaultCountryMatch = supportedCountries.find(
      c => c.code.toUpperCase() === defaultCountryCode.toUpperCase() && c.enabled
    ) || supportedCountries[0] || { code: 'AE', name: 'United Arab Emirates', currency: 'AED', enabled: true };

    // 1. Check Cloudflare / Proxy headers
    const cfCountry = req.headers['cf-ipcountry'] ? String(req.headers['cf-ipcountry']).toUpperCase() : null;
    let detectedCountryCode: string | null = cfCountry;

    // 2. Extract Client IP
    const rawIp = (req.headers['x-forwarded-for']
      ? String(req.headers['x-forwarded-for']).split(',')[0]
      : req.headers['x-real-ip'] || req.socket.remoteAddress || '') as string;

    const cleanIp = rawIp.replace(/^::ffff:/, '').trim();
    const isLocalhost = !cleanIp || cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp.startsWith('192.168.') || cleanIp.startsWith('10.') || cleanIp.startsWith('172.');

    // 3. Perform IP Geolocation lookup if not already provided by CDN header
    if (!detectedCountryCode) {
      if (isLocalhost) {
        // Safe Localhost Development Fallback -> Pakistan (PK) for local testing
        detectedCountryCode = 'PK';
      } else {
        try {
          // Fast server-side IP lookup without exposing API keys
          const res = await fetch(`https://ipapi.co/${cleanIp}/json/`, {
            headers: { 'User-Agent': 'RUBTA-Storefront-Geo/1.0' },
            signal: AbortSignal.timeout(3000)
          });
          if (res.ok) {
            const geo = await res.json();
            if (geo && geo.country_code) {
              detectedCountryCode = String(geo.country_code).toUpperCase();
            }
          }
        } catch (_) {
          // If external lookup times out or fails, fall back to null
          detectedCountryCode = null;
        }
      }
    }

    // 4. Match detected ISO country code against supported countries
    if (detectedCountryCode) {
      const match = supportedCountries.find(
        c => c.code.toUpperCase() === detectedCountryCode?.toUpperCase() && c.enabled
      );

      if (match) {
        return {
          countryCode: match.code,
          country: match.name,
          currency: match.currency,
          supported: true,
          source: 'ip'
        };
      }
    }

    // 5. Fallback to configured default country if unsupported or lookup failed
    return {
      countryCode: defaultCountryMatch.code,
      country: defaultCountryMatch.name,
      currency: defaultCountryMatch.currency,
      supported: false,
      source: 'fallback'
    };
  }
};
