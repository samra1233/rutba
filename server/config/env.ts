import dotenv from 'dotenv';
dotenv.config();

export interface ServerEnv {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  stripeSecretKey: string;
}

export function validateEnv(): ServerEnv {
  const port = Number(process.env.PORT) || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const jwtSecret = process.env.JWT_SECRET || 'super-secret-rubta-jwt-key';
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

  return {
    port,
    nodeEnv,
    jwtSecret,
    stripeSecretKey
  };
}

export const env = validateEnv();
