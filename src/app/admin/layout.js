'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 mt-6">
        <Toaster position="top-right" />
        <AdminSidebar />
        <main className="flex-1 p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}