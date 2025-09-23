import { QueryClient } from '@tanstack/react-query';
import { Todo } from '../../../types/todo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export const dynamic = "force-dynamic";

// Server-side query function for React Query
export async function fetchTodosServer(): Promise<Todo[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.status}`);
  }

  return response.json();
}

// Prefetch function for server-side rendering
export async function prefetchTodos(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodosServer,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export async function GET(request: Request) {
  try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getServerSession(authOptions as unknown as any);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const allTodos = await fetchTodosServer();
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTodos = allTodos.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(allTodos.length / limit);
    
    return Response.json({
      data: paginatedTodos,
      pagination: {
        page,
        limit,
        total: allTodos.length,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error while fetching todos.";
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


