import { db } from '@/lib/db';
import { sessions, messages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/conversations/[id] - Get session with all messages
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // Get session details
    const sessionData = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (sessionData.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionData[0];

    // Get all messages for this session in correct order
    const sessionMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(asc(messages.orderIndex), asc(messages.createdAt));

    // Transform messages to match expected API format
    const transformedMessages = sessionMessages.map(msg => ({
      id: msg.id,
      role: msg.role === 'human' ? 'user' : msg.role === 'ai' ? 'assistant' : msg.role, // Map back for compatibility
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
      createdAt: msg.createdAt,
      orderIndex: msg.orderIndex,
      isComplete: msg.isComplete,
    }));

    // Return session with messages
    const result = {
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.lastActiveAt, // For backward compatibility
      lastActiveAt: session.lastActiveAt,
      messages: transformedMessages,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

// PATCH /api/conversations/[id] - Update session (title, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const { title } = await request.json();

    // Check if session exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (existingSession.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Update session title and last active time
    const updatedSession = await db
      .update(sessions)
      .set({ 
        title, 
        lastActiveAt: new Date() 
      })
      .where(eq(sessions.id, sessionId))
      .returning();

    if (updatedSession.length === 0) {
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    const result = {
      id: updatedSession[0].id,
      title: updatedSession[0].title,
      createdAt: updatedSession[0].createdAt,
      updatedAt: updatedSession[0].lastActiveAt, // For backward compatibility
      lastActiveAt: updatedSession[0].lastActiveAt,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

// DELETE /api/conversations/[id] - Delete session and all its messages (cascade delete)
export async function DELETE(
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

    // Delete the session (messages will be cascade deleted due to foreign key constraint)
    await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId));

    return NextResponse.json({ success: true, id: sessionId });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
