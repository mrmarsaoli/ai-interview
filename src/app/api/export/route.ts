import { db } from '@/lib/db';
import { sessions, messages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/export - Export all conversations as JSON
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversation');

    let conversationsData;

    if (conversationId) {
      // Export single session
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, conversationId))
        .limit(1);

      if (session.length === 0) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Get messages for this session
      const sessionMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.sessionId, conversationId))
        .orderBy(asc(messages.orderIndex));

      conversationsData = [{
        id: session[0].id,
        title: session[0].title,
        createdAt: session[0].createdAt.toISOString(),
        updatedAt: session[0].lastActiveAt.toISOString(),
        messages: sessionMessages.map(msg => ({
          id: msg.id,
          role: msg.role === 'human' ? 'user' : 'assistant', // Map back for export compatibility
          content: msg.content,
          timestamp: msg.createdAt.toISOString()
        }))
      }];
    } else {
      // Export all sessions
      const allSessions = await db
        .select()
        .from(sessions)
        .orderBy(asc(sessions.createdAt));

      conversationsData = [];
      
      for (const session of allSessions) {
        const sessionMessages = await db
          .select()
          .from(messages)
          .where(eq(messages.sessionId, session.id))
          .orderBy(asc(messages.orderIndex));

        conversationsData.push({
          id: session.id,
          title: session.title,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.lastActiveAt.toISOString(),
          messages: sessionMessages.map(msg => ({
            id: msg.id,
            role: msg.role === 'human' ? 'user' : 'assistant', // Map back for export compatibility
            content: msg.content,
            timestamp: msg.createdAt.toISOString()
          }))
        });
      }
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      exportType: conversationId ? 'single' : 'all',
      conversations: conversationsData,
      totalConversations: conversationsData.length,
      totalMessages: conversationsData.reduce((sum, conv) => sum + conv.messages.length, 0),
      exportedBy: 'Indonesian Holiday Assistant'
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting conversations:', error);
    return NextResponse.json({ error: 'Failed to export conversations' }, { status: 500 });
  }
}
