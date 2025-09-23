import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from '../types/todo';

async function fetchPostById(id: string): Promise<Todo> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Post not found');
  }

  return response.json();
}

async function updatePost(updatedPost: Todo): Promise<Todo> {
  const response = await fetch(`/api/todos/${updatedPost.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  return response.json();
}

export function usePost(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      queryClient.setQueryData(['post', id], data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    data,
    isLoading,
    error,
    updatePost: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
