'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by trying to fetch profile
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.push('/dashboard');
        } else {
          // User is not authenticated, redirect to login
          router.push('/auth/login');
        }
      } catch (error) {
        // On error, redirect to login
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-2xl font-semibold">Loading...</div>
    </div>
  );
}
