import jwt from 'jsonwebtoken';
import { getEnv } from './environment';
import { JwtPayload } from '../../common/types/auth';
import { pbkdf2Sync, randomBytes } from 'crypto';

export function getAccessToken(email: string, userId: string): { token: string; expiresAt: Date } {
  const [JWT_SECRET, TOKEN_EXPIRY] = getEnv('JWT_SECRET', 'TOKEN_EXPIRY');
  const nDaysInSeconds = Number(TOKEN_EXPIRY) * 24 * 60 * 60;
  const token = jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: nDaysInSeconds });
  const nowInSeconds = new Date().getTime() / 1000;
  const expiresAt = new Date((nowInSeconds + nDaysInSeconds) * 1000);
  return { token, expiresAt };
}

function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

function hashString(str: string, salt: string): string {
  return pbkdf2Sync(str, salt, 100000, 64, 'sha512').toString('hex');
}

export function getHashed(rawString: string): { hashedString: string; salt: string } {
  const salt = generateSalt();
  const hashedString = hashString(rawString, salt);
  return { hashedString, salt };
}

export function getLoginCode(): {
  loginCode: string;
  hashedLoginCode: string;
  loginCodeExpires: Date;
  salt: string;
} {
  const { loginCode, loginCodeExpires } = generateLoginCode();
  const { hashedString: hashedLoginCode, salt } = getHashed(loginCode);

  return {
    loginCode,
    hashedLoginCode,
    loginCodeExpires,
    salt,
  };
}

function generateLoginCode(): { loginCode: string; loginCodeExpires: Date } {
  const [LOGIN_CODE_EXPIRY] = getEnv('LOGIN_CODE_EXPIRY');
  const now = new Date().getTime();
  const expiryInMillis = Number(LOGIN_CODE_EXPIRY) * 60 * 1000;
  const loginCodeExpires = new Date(now + expiryInMillis);
  return {
    loginCode: Math.floor(100000 + Math.random() * 900000).toString(),
    loginCodeExpires,
  };
}

export function validateLoginCode(
  loginCode: string,
  salt: string,
  hashedLoginCode: string,
  loginCodeExpires: Date | string
): 'valid' | 'invalid' | 'expired' {
  const hash = hashString(loginCode, salt);
  if (hash !== hashedLoginCode) return 'invalid';
  if (new Date() >= new Date(loginCodeExpires)) return 'expired';
  return 'valid';
}

export function validatePassword(password: string, hashedPassword: string, salt: string): boolean {
  const hash = hashString(password, salt);
  return hash === hashedPassword;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const [JWT_SECRET] = getEnv('JWT_SECRET');
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (_e) {
    return null;
  }
}
