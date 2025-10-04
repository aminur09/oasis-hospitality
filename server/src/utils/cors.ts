import type { CorsOptions } from 'cors';

export function createCorsOptions(): CorsOptions {
  const originEnv = process.env.CORS_ORIGIN || '';
  const allowedOrigins = originEnv.split(',').map((o) => o.trim()).filter(Boolean);

  return {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };
}