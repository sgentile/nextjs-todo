'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTodos } from '../hooks/useTodos';
import Pagination from './Pagination';

interface PostsProps {
  initialPage?: number;
}

export default function Posts({ initialPage = 1 }: PostsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || initialPage.toString());
  const pageSize = 10;
  
  const { data, isLoading, error } = useTodos(currentPage, pageSize);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page'); // Remove page param for page 1 to keep URL clean
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    router.push(`/${queryString ? `?${queryString}` : ''}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Loading todos...</h2>
        <div className="space-y-2">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded border p-3 bg-gray-100 animate-pulse"
            >
              <div className="w-4 h-4 bg-gray-300 rounded mt-1"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-red-600">Error loading todos</h2>
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  const todos = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Todos</h2>
        {pagination && (
          <span className="text-sm text-gray-600">
            Showing {todos.length} of {pagination.total} todos
          </span>
        )}
      </div>
      
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="rounded border bg-blue-100 text-black hover:bg-blue-200 transition-colors duration-200"
          >
            <Link 
              href={`/post/${todo.id}${currentPage > 1 ? `?page=${currentPage}` : ''}`}
              className="flex items-start gap-3 p-3 block"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                readOnly
                className="mt-1 pointer-events-none"
              />
              <span className="select-text flex-1">{todo.title}</span>
              <span className="text-blue-600 text-sm font-medium">
                View Details →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      
      {pagination && (
        <Pagination 
          pagination={pagination} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
}


