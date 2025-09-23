'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { usePost } from '../hooks/usePost';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostDetail({ id }: { id: string }) {
  const { data: post, isLoading, error, updatePost, isUpdating } = usePost(id);
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const backHref = `/${page ? `?page=${page}` : ''}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (post) {
      reset(post);
    }
  }, [post, reset]);

  const onSubmit = (data: PostFormData) => {
    if (post) {
      updatePost({ ...post, ...data });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl w-full mx-auto space-y-6 p-8">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl w-full mx-auto space-y-6 p-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Post not found</h1>
          <Link href={backHref} className="text-blue-600 hover:text-blue-800">Back to Posts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6 p-8">
      <div className="mb-6">
        <Link 
          href={backHref} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Posts
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Post #{post.id}
          </h1>
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('completed')}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className={`ml-2 text-sm font-medium ${
              post.completed ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {post.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-lg font-semibold text-gray-700 mb-2">Title</label>
            <input
              id="title"
              {...register('title')}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="ml-2 text-gray-900">{post.userId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Post ID:</span>
                <span className="ml-2 text-gray-900">{post.id}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
