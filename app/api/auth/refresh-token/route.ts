import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, generateTokens, setAuthCookies, getTokenFromRequest } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies or request body
    let refreshToken = getTokenFromRequest(true);
    
    // If no token in cookies, try to get from request body
    if (!refreshToken) {
      try {
        const body = await request.json();
        refreshToken = body.refreshToken;
      } catch (e) {
        // No body or invalid JSON
      }
    }

    // If no refresh token found
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const tokenPayload = verifyToken(refreshToken, true);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Set cookies
    setAuthCookies(tokens);

    // Return new tokens
    return NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get refresh token from cookies
    let refreshToken = await getTokenFromRequest(true);
    
    // ... existing code ...
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
} 