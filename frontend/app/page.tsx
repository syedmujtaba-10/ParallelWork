'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { FiMessageSquare, FiCheckCircle, FiCpu } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Flight Booking System
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            AI-powered multi-agent flight booking with intelligent conversation
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <FiMessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Conversational Interface
            </h3>
            <p className="text-gray-600">
              Book flights naturally through conversation with our AI assistant
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Easy Management
            </h3>
            <p className="text-gray-600">
              View, track, and manage all your bookings in one place
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center mb-4">
              <FiCpu className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multi-Agent AI
            </h3>
            <p className="text-gray-600">
              Powered by specialized AI agents for booking, status, and cancellations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
