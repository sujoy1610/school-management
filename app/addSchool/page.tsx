'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image?: FileList;
}

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage('');
    let imageUrl = '';

    try {
      // Upload image first if provided
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append('image', data.image[0]);

        const uploadResponse = await fetch('/api/schools/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      // Submit school data
      const schoolData = {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        contact: data.contact.trim(),
        email_id: data.email_id.trim().toLowerCase(),
        image: imageUrl,
      };

      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add school');
      }

      const result = await response.json();
      setMessageType('success');
      setMessage('School added successfully!');
      reset();
      setImagePreview(null);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/schools');
      }, 2000);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add New School</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            School Name *
          </label>
          <input
            type="text"
            {...register('name', { 
              required: 'School name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' }
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter school name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Address *
          </label>
          <textarea
            {...register('address', { 
              required: 'Address is required',
              minLength: { value: 10, message: 'Address must be at least 10 characters' }
            })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter school address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              City *
            </label>
            <input
              type="text"
              {...register('city', { 
                required: 'City is required',
                minLength: { value: 2, message: 'City must be at least 2 characters' }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              State *
            </label>
            <input
              type="text"
              {...register('state', { 
                required: 'State is required',
                minLength: { value: 2, message: 'State must be at least 2 characters' }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            {...register('contact', { 
              required: 'Contact number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number'
              }
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter 10-digit contact number"
          />
          {errors.contact && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email_id', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address"
          />
          {errors.email_id && (
            <p className="mt-1 text-sm text-red-600">{errors.email_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            School Logo/Image
          </label>
          <input
            type="file"
            {...register('image')}
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding School...' : 'Add School'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/schools')}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}