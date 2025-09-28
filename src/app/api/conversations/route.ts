import { db } from '@/lib/db';
import { sessions, messages, generateSessionId, generateMessageId } from '@/lib/db/schema';
import { desc, eq, sql, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/conversations - Get all sessions with message counts and last message preview
export async function GET() {
  try {
    // Get sessions with message count and last message info
    const sessionsWithData = await db
      .select({
        id: sessions.id,
        title: sessions.title,
        createdAt: sessions.createdAt,
        lastActiveAt: sessions.lastActiveAt,
        messageCount: count(messages.id),
        lastMessageContent: sql<string>`MAX(${messages.content})`,
        lastMessageRole: sql<'human' | 'ai'>`MAX(${messages.role})`,
        lastMessageTime: sql<Date>`MAX(${messages.createdAt})`,
      })
      .from(sessions)
      .leftJoin(messages, eq(sessions.id, messages.sessionId))
      .groupBy(sessions.id)
      .orderBy(desc(sessions.lastActiveAt));

    // Transform to match expected API format
    const transformedSessions = sessionsWithData.map(session => ({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.lastActiveAt, // For backward compatibility
      lastActiveAt: session.lastActiveAt,
      messageCount: session.messageCount,
      lastMessage: session.lastMessageContent ? {
        content: session.lastMessageContent,
        role: session.lastMessageRole,
        createdAt: session.lastMessageTime,
      } : undefined,
    }));

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST /api/conversations - Create new session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      firstMessage, 
      sessionId // Allow client to specify session ID for persistence
    } = body;

    // Use provided session ID or generate new one
    const newSessionId = sessionId || generateSessionId();
    const sessionTitle = title || 'New Chat';

    // Check if session already exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, newSessionId))
      .limit(1);

    let session;
    if (existingSession.length > 0) {
      // Update existing session
      await db
        .update(sessions)
        .set({ 
          title: sessionTitle,
          lastActiveAt: new Date() 
        })
        .where(eq(sessions.id, newSessionId));
      
      session = existingSession[0];
    } else {
      // Create new session
      const newSession = {
        id: newSessionId,
        title: sessionTitle,
        createdAt: new Date(),
        lastActiveAt: new Date(),
      };

      await db.insert(sessions).values(newSession);
      session = newSession;
    }

    // Add first message if provided
    if (firstMessage) {
      // Get current message count for order index
      const messageCount = await db
        .select({ count: count(messages.id) })
        .from(messages)
        .where(eq(messages.sessionId, newSessionId));

      const orderIndex = messageCount[0]?.count || 0;

      // Map role from old format to new format
      let role: 'human' | 'ai' = 'human';
      if (firstMessage.role === 'user') role = 'human';
      else if (firstMessage.role === 'assistant') role = 'ai';
      else role = firstMessage.role as 'human' | 'ai';

      const newMessage = {
        id: generateMessageId(),
        sessionId: newSessionId,
        role,
        content: firstMessage.content,
        orderIndex,
        createdAt: new Date(),
        isComplete: true,
        streamSequence: 0,
      };

      await db.insert(messages).values(newMessage);

      // Update session's last active time
      await db
        .update(sessions)
        .set({ lastActiveAt: new Date() })
        .where(eq(sessions.id, newSessionId));
    }

    return NextResponse.json({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.lastActiveAt, // For backward compatibility
      lastActiveAt: session.lastActiveAt,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
