import { notFound } from 'next/navigation';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PostDetail from '../../../components/PostDetail';

async function fetchPost(id: string) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Await params first
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  // Prefetch
  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const post = await fetchPost(id);
      if (!post) {
        throw new Error('not-found');
      }
      return post;
    },
  });

  const dehydratedState = dehydrate(queryClient);

  // If cache indicates error/not found, handle 404 before rendering
  const cached = queryClient.getQueryState(['post', id]);
  if (cached?.status === 'error') {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostDetail id={id} />
    </HydrationBoundary>
  );
}
