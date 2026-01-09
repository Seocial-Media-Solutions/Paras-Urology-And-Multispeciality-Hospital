'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { Image, Users, } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      setAdminEmail(auth.currentUser.email);
    }
  }, []);

 

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {adminEmail || 'Admin'}
        </p>
      </div>

    

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/hero-section"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">Update Hero Section Image</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Hero image updated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Admin logged in</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Settings updated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-md text-white">
        <h2 className="text-xl font-bold mb-2">Paras Urology & Multispeciality Hospital</h2>
        <p className="text-blue-100">
          Manage your hospital's online presence from this admin panel. Update content, monitor activity, and keep your website fresh.
        </p>
      </div>
    </div>
  );
}