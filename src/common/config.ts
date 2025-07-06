import dotenv from "dotenv";

dotenv.config();

export const makeConfig = () => {
  const LIVE_ENVS = ["production", "staging"];
  const ENV = process.env.NODE_ENV || "development";
  const PORT = process.env.PORT || 3001;
  const API_BASE_URL =
    process.env.API_BASE_URL ||
    `http://${process.env.HOSTNAME || "localhost"}:${PORT}`;
  // Base configuration
  const baseConfig = {
    // Server configuration
    PORT,
    NODE_ENV: ENV,

    // Database configuration
    MONGODB_URI: (() => {
      switch (true) {
        case LIVE_ENVS.includes(ENV):
          return process.env.MONGODB_URI;
        case ENV === "test":
          return process.env.TEST_MONGODB_URI;
        default:
          return process.env.MONGODB_URI;
      }
    })(),
    DATABASE_POOL_MIN: parseInt(process.env.DATABASE_POOL_MIN || "10", 10),
    DATABASE_POOL_MAX: parseInt(process.env.DATABASE_POOL_MAX || "25", 10),
    DATABASE_COMPRESSION: process.env.DATABASE_COMPRESSION || "snappy",

    // Base URL configuration
    API_BASE_URL,

    // // Authentication configuration
    // AUTH: {
    //   TOKEN_ISSUER: process.env.AUTH_TOKEN_ISSUER || "https://qti-api",
    //   REQUIRE_CREDENTIALS:
    //     process.env.AUTH_REQUIRE_CREDENTIALS === "true" || false,
    // },
    // MCP: { CLIENT_ID: process.env.MCP_CLIENT_ID },
  } as const;

  // TODO: Configure Sentry
  // Sentry configuration
  const SENTRY_DSN = process.env.SENTRY_DSN || "";
  const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || "";
  const SENTRY_ENABLED = process.env.SENTRY_ENABLED === "true" || false;
  const SENTRY_ENV = process.env.SENTRY_ENV || ENV;

  return {
    ...baseConfig,
    API_BASE_URL,
    SENTRY_DSN,
    SENTRY_AUTH_TOKEN,
    SENTRY_ENABLED,
    SENTRY_ENV,
  } as const;
};

// Create the config
export const config = makeConfig();

// Validate required environment variables in production
if (config.NODE_ENV === "production") {
  const requiredEnvVars = ["MONGODB_URI", "AUTH_TOKEN_ISSUER"] as const;

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
