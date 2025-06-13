import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const getEnv = (key: string, defaultValue?: string): string => {
  if ((process.env[key] || defaultValue) === undefined)
    throw new Error(`Environment variable ${key} does not exist`);

  return process.env[key] || defaultValue || "";
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "3000");
export const CLIENT_APP_ORIGIN = getEnv(
  "CLIENT_APP_ORIGIN",
  "http://localhost:3000"
);
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const JWT_TOKEN = getEnv("JWT_TOKEN");
// export const JWT_
