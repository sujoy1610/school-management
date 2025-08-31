'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/schools');
      if (response.ok) {
        const schools = await response.json();
        setStats({
          totalSchools: schools.length,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalSchools: 0, loading: false });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center py-12 mb-12">
        <div className="mb-6">
          <span className="text-6xl mb-4 block">🏫</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          School Management
          <span className="text-blue-600 block mt-2">System</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Manage school information efficiently with our modern, user-friendly platform. 
          Add new schools, browse existing ones, and keep everything organized in one place.
        </p>
        
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.loading ? '...' : stats.totalSchools}
            </div>
            <div className="text-gray-600 font-medium">
              Schools Registered
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Add School Card */}
        <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">➕</div>
            <h2 className="text-2xl font-bold mb-3">Add New School</h2>
            <p className="opacity-90 leading-relaxed">
              Register new schools with comprehensive information including images, 
              contact details, location data, and more.
            </p>
          </div>
          <div className="p-8">
            <ul className="text-gray-600 mb-6 space-y-3">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Upload school images</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Form validation & error handling</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Complete contact information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Address & location details</span>
              </li>
            </ul>
            <Link
              href="/addSchool"
              className="inline-block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Add School →
            </Link>
          </div>
        </div>

        {/* View Schools Card */}
        <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👀</div>
            <h2 className="text-2xl font-bold mb-3">View All Schools</h2>
            <p className="opacity-90 leading-relaxed">
              Browse through all registered schools in an attractive, 
              responsive gallery format similar to modern e-commerce sites.
            </p>
          </div>
          <div className="p-8">
            <ul className="text-gray-600 mb-6 space-y-3">
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>Modern card-based gallery</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>Mobile responsive design</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>Detailed school information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>Contact & location data</span>
              </li>
            </ul>
            <Link
              href="/showSchools"
              className="inline-block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Schools →
            </Link>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Built with Modern Technologies
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-3xl mb-3">⚛️</div>
            <div className="font-medium text-gray-900">Next.js 14</div>
            <div className="text-sm text-gray-600">App Router</div>
          </div>
          <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-3xl mb-3">🗄️</div>
            <div className="font-medium text-gray-900">MySQL</div>
            <div className="text-sm text-gray-600">Database</div>
          </div>
          <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-3xl mb-3">🎨</div>
            <div className="font-medium text-gray-900">Tailwind CSS</div>
            <div className="text-sm text-gray-600">Styling</div>
          </div>
          <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-3xl mb-3">📱</div>
            <div className="font-medium text-gray-900">Responsive</div>
            <div className="text-sm text-gray-600">Mobile-First</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/addSchool"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ➕ Add First School
          </Link>
          <Link
            href="/showSchools"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            👀 Browse Schools
          </Link>
        </div>
      </div>
    </div>
  );
}