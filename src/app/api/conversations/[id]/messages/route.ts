import { db } from '@/lib/db';
import { sessions, messages, generateMessageId } from '@/lib/db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// POST /api/conversations/[id]/messages - Add message to session
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const { role, content, toolCalls } = await request.json();

    // Check if session exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (existingSession.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get current message count for order index
    const messageCount = await db
      .select({ count: count(messages.id) })
      .from(messages)
      .where(eq(messages.sessionId, sessionId));

    const orderIndex = messageCount[0]?.count || 0;

    // Map role from API format to schema format
    let dbRole: 'human' | 'ai' = 'human';
    if (role === 'user') dbRole = 'human';
    else if (role === 'assistant') dbRole = 'ai';
    else dbRole = role as 'human' | 'ai';

    // Create new message
    const newMessage = {
      id: generateMessageId(),
      sessionId: sessionId,
      role: dbRole,
      content: content,
      orderIndex: orderIndex,
      createdAt: new Date(),
      isComplete: true,
      streamSequence: 0,
    };

    // Insert message
    await db.insert(messages).values(newMessage);

    // Update session's last active time
    await db
      .update(sessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(sessions.id, sessionId));

    // Return message in API format
    const responseMessage = {
      id: newMessage.id,
      role: newMessage.role === 'human' ? 'user' : newMessage.role === 'ai' ? 'assistant' : newMessage.role,
      content: newMessage.content,
      timestamp: newMessage.createdAt.toISOString(),
      createdAt: newMessage.createdAt,
      orderIndex: newMessage.orderIndex,
      isComplete: newMessage.isComplete,
      toolCalls: toolCalls || undefined, // Pass through tool calls for compatibility
    };

    return NextResponse.json(responseMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

// GET /api/conversations/[id]/messages - Get all messages for session
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // Check if session exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (existingSession.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get all messages for this session in correct order
    const sessionMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(asc(messages.orderIndex), asc(messages.createdAt));

    // Transform messages to match expected API format
    const transformedMessages = sessionMessages.map(msg => ({
      id: msg.id,
      role: msg.role === 'human' ? 'user' : msg.role === 'ai' ? 'assistant' : msg.role,
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
      createdAt: msg.createdAt,
      orderIndex: msg.orderIndex,
      isComplete: msg.isComplete,
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
