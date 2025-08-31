'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image?: string;
  created_at?: string;
}

function SchoolCard({ school }: { school: School }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {school.image ? (
            <Image
    src={school.image.startsWith('/') ? school.image : `/schoolImages/${school.image}`}
    alt={`${school.name} logo`}
    width={80}
    height={80}
    className="rounded-lg object-cover"
  />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-2xl font-bold">
                {school.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
            {school.name}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-start">
              <span className="font-medium w-16 flex-shrink-0">Address:</span>
              <span className="ml-2">{school.address}, {school.city}, {school.state}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-16 flex-shrink-0">Phone:</span>
              <span className="ml-2">{school.contact}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-16 flex-shrink-0">Email:</span>
              <span className="ml-2 text-blue-600 truncate">{school.email_id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const router = useRouter();

  // Get unique states for filter dropdown
  const uniqueStates = Array.from(new Set(schools.map(school => school.state))).sort();

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm, stateFilter]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools');
      
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }

      const data = await response.json();
      setSchools(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterSchools = () => {
    let filtered = schools;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (stateFilter) {
      filtered = filtered.filter(school => school.state === stateFilter);
    }

    setFilteredSchools(filtered);
  };

  const handleRefresh = () => {
    fetchSchools();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error loading schools:</p>
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schools Directory</h1>
          <p className="text-gray-600">Browse all schools in our network</p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search schools by name, city, state, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Showing {filteredSchools.length} of {schools.length} school{schools.length !== 1 ? 's' : ''}
            </p>
            {!loading && (
              <button
                onClick={handleRefresh}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh
              </button>
            )}
          </div>
          <button 
            onClick={() => router.push('/addSchool')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New School
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || stateFilter ? 'No schools found' : 'No schools available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || stateFilter 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by adding your first school.'}
            </p>
            {(searchTerm || stateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStateFilter('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}