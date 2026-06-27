export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export interface UploadConfig {
  dir: string;
  maxFileSize: number;
}

export interface CorsConfig {
  origin: string;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwt: JwtConfig;
  upload: UploadConfig;
  cors: CorsConfig;
  rateLimit: RateLimitConfig;
  smtp: SmtpConfig;
}
