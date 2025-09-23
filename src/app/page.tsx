import { Suspense } from 'react';
import Posts from "../components/Posts";
import PostsLoading from "../components/PostsLoading";
import { fetchTodosServer } from "./api/todos/route";
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
interface HomeProps {
  searchParams: { page?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1');
  const limit = 10;
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  // Prefetch the current page data
  await queryClient.prefetchQuery({
    queryKey: ['todos', page, limit],
    queryFn: async () => {
      const allTodos = await fetchTodosServer();
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTodos = allTodos.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allTodos.length / limit);
      
      return {
        data: paginatedTodos,
        pagination: {
          page,
          limit,
          total: allTodos.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 gap-16">
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<PostsLoading />}>
          <Posts initialPage={page} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
