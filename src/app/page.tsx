import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppContent } from '@/components/app-content/AppContent';

export default function HomePage(): JSX.Element {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
