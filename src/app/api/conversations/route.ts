import { loadIndex, createConversation } from '@/lib/storage/json-store';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// GET /api/conversations - Get all conversations with message counts
export async function GET() {
  try {
    const index = loadIndex();
    return NextResponse.json(index.conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: Request) {
  try {
    const { title, firstMessage } = await request.json();
    
    const firstMsg = firstMessage ? {
      id: nanoid(),
      role: firstMessage.role as 'user' | 'assistant',
      content: firstMessage.content,
      timestamp: new Date().toISOString()
    } : undefined;
    
    const conversation = createConversation(title || 'New Conversation', firstMsg);

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
