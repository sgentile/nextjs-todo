'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NotFound() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const backHref = `/${page ? `?page=${page}` : ''}`;
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

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">
          The post you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href={backHref}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Return to Posts
        </Link>
      </div>
    </div>
  );
}
