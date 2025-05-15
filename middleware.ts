import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromRequest } from './utils/auth';

// Define paths that should be protected
const PROTECTED_PATHS = [
  '/crop-suggestion',
  '/plant-disease',
  '/soil-analysis',
  '/whatsapp-bot',
  '/dashboard',
  '/profile',
];

// Define auth-related paths that should be accessible without auth
const AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for non-protected routes
  if (!PROTECTED_PATHS.some(path => pathname.startsWith(path)) && 
      !pathname.startsWith('/api/') && 
      !pathname === '/auth/me') {
    return NextResponse.next();
  }
  
  // Skip authentication for auth-specific routes
  if (AUTH_PATHS.some(path => pathname === path)) {
    return NextResponse.next();
  }
  
  // Allow public API endpoints
  if (pathname.startsWith('/api/auth/login') || 
      pathname.startsWith('/api/auth/register') || 
      pathname.startsWith('/api/auth/refresh-token')) {
    return NextResponse.next();
  }
  
  try {
    // Get token from cookies or header
    const token = await getTokenFromRequest();
    
    // If no token found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Verify token
    verifyToken(token);
    
    // Continue with the request if token is valid
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, try to refresh token
    const refreshToken = await getTokenFromRequest(true);
    
    if (refreshToken) {
      try {
        // Verify refresh token
        verifyToken(refreshToken, true);
        
        // Redirect to refresh token endpoint
        return NextResponse.redirect(new URL('/api/auth/refresh-token', request.url));
      } catch (refreshError) {
        // If refresh token is invalid, redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } else {
      // No refresh token, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 