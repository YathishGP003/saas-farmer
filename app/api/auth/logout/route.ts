import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/utils/auth';

export async function POST(request: NextRequest) {
  // Clear authentication cookies
  clearAuthCookies();
  
  // Return success response
  return NextResponse.json({ success: true });
} 