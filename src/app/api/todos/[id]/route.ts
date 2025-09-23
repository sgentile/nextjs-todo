import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getServerSession(authOptions as unknown as any);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params; // ✅ Await params first
    const body = await request.json();

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    const updatedPost = await response.json();
    return NextResponse.json(updatedPost);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error while updating post.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
