import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Type for token payload
export interface TokenPayload {
  userId: string;
  email: string;
}

// Type for tokens
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Password verification
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT tokens (access + refresh)
export const generateTokens = (payload: TokenPayload): Tokens => {
  // Get secrets and expiration from environment variables
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
  
  const accessExpiration = process.env.JWT_ACCESS_EXPIRATION 
    ? parseInt(process.env.JWT_ACCESS_EXPIRATION) 
    : 3600; // Default: 1 hour
    
  const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION 
    ? parseInt(process.env.JWT_REFRESH_EXPIRATION) 
    : 2592000; // Default: 30 days

  // Generate tokens
  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiration,
  });

  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiration,
  });

  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token: string, isRefreshToken = false): TokenPayload => {
  const secret = isRefreshToken 
    ? process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
    : process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';
    
  return jwt.verify(token, secret) as TokenPayload;
};

// Set cookies in response
export const setAuthCookies = (tokens: Tokens) => {
  const cookieStore = cookies();
  
  // Access token (http-only, secure in production)
  cookieStore.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: process.env.JWT_ACCESS_EXPIRATION 
      ? parseInt(process.env.JWT_ACCESS_EXPIRATION) 
      : 3600,
    path: '/',
  });
  
  // Refresh token (http-only, secure in production)
  cookieStore.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: process.env.JWT_REFRESH_EXPIRATION 
      ? parseInt(process.env.JWT_REFRESH_EXPIRATION) 
      : 2592000,
    path: '/',
  });
};

// Clear auth cookies
export const clearAuthCookies = () => {
  const cookieStore = cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
};

// Get token from cookies or authorization header
export const getTokenFromRequest = async (isRefreshToken = false): Promise<string | null> => {
  const cookieStore = cookies();
  const cookieName = isRefreshToken ? 'refresh_token' : 'access_token';
  
  const token = await cookieStore.get(cookieName)?.value;
  
  return token || null;
}; 