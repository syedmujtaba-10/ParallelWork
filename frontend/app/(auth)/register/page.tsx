import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Register for a new flight booking account</p>
        </div>

        <Card padding="lg">
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
}
