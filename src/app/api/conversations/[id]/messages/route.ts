import { addMessageToConversation, loadConversation } from '@/lib/storage/json-store';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// POST /api/conversations/[id]/messages - Add message to conversation
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { role, content, toolCalls } = await request.json();

    // Create new message
    const message = {
      id: nanoid(),
      role: role as 'user' | 'assistant',
      content: content,
      timestamp: new Date().toISOString(),
      toolCalls: toolCalls || undefined
    };

    const updatedConversation = addMessageToConversation(conversationId, message);
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

// GET /api/conversations/[id]/messages - Get all messages for conversation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const conversation = loadConversation(conversationId);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
