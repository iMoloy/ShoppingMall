export interface EnvConfig {
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  PORT: number;
}

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const errors: string[] = [];

  const requireString = (key: string, minLength = 1): string => {
    const value = config[key];
    if (typeof value !== 'string' || value.length < minLength) {
      errors.push(`${key} must be a string with at least ${minLength} characters`);
      return '';
    }
    return value;
  };

  const databaseUrl = requireString('DATABASE_URL');
  const jwtAccessSecret = requireString('JWT_ACCESS_SECRET', 32);
  const jwtRefreshSecret = requireString('JWT_REFRESH_SECRET', 32);

  if (jwtAccessSecret && jwtRefreshSecret && jwtAccessSecret === jwtRefreshSecret) {
    errors.push('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n  - ${errors.join('\n  - ')}`,
    );
  }

  return {
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_ACCESS_EXPIRES: (config.JWT_ACCESS_EXPIRES as string) || '15m',
    JWT_REFRESH_EXPIRES: (config.JWT_REFRESH_EXPIRES as string) || '7d',
    FRONTEND_URL: (config.FRONTEND_URL as string) || 'http://localhost:3000',
    NODE_ENV: (config.NODE_ENV as string) || 'development',
    PORT: parseInt(config.PORT as string, 10) || 4000,
  };
}
