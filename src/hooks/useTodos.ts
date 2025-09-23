import { useQuery } from '@tanstack/react-query';
import { Todo, PaginatedResponse } from '../types/todo';

async function fetchTodos(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Todo>> {
  const response = await fetch(`/api/todos?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return response.json();
}

export function useTodos(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['todos', page, limit],
    queryFn: () => fetchTodos(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
