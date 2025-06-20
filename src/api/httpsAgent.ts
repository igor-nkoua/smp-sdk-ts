// httpsAgent.ts
import fs from 'fs';
import { Agent as UndiciAgent } from 'undici';
import https from 'https';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const isProdOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

export const undiciAgent = isProdOrStaging
  ? new UndiciAgent({
      connect: {
        cert: fs.readFileSync(requiredEnv("CERT_PATH")),
        key: fs.readFileSync(requiredEnv("KEY_PATH")),
        ca: fs.readFileSync(requiredEnv("CA_PATH")),
        rejectUnauthorized: true,
      },
    })
  : undefined;

export const httpsAgent = isProdOrStaging
  ? new https.Agent({
      cert: fs.readFileSync(requiredEnv("CERT_PATH")),
      key: fs.readFileSync(requiredEnv("KEY_PATH")),
      ca: fs.readFileSync(requiredEnv("CA_PATH")),
      rejectUnauthorized: true,
    })
  : undefined;
