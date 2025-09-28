import { db } from '@/lib/db';
import { sessions, messages, generateSessionId, generateMessageId } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// POST /api/import - Import conversations from JSON
export async function POST(request: Request) {
  try {
    const importData = await request.json();

    // Validate the import data structure
    if (!importData.conversations || !Array.isArray(importData.conversations)) {
      return NextResponse.json({ error: 'Invalid import format: missing conversations array' }, { status: 400 });
    }

    if (importData.version !== '1.0') {
      return NextResponse.json({ error: 'Unsupported export version' }, { status: 400 });
    }

    let imported = 0;
    let totalMessages = 0;
    const errors: string[] = [];

    for (const conv of importData.conversations) {
      try {
        // Generate new session ID to avoid conflicts
        const newSessionId = generateSessionId();

        // Create session
        const newSession = {
          id: newSessionId,
          title: conv.title || 'Imported Chat',
          createdAt: conv.createdAt ? new Date(conv.createdAt) : new Date(),
          lastActiveAt: conv.updatedAt ? new Date(conv.updatedAt) : new Date(),
        };

        await db.insert(sessions).values(newSession);

        // Import messages
        if (conv.messages && Array.isArray(conv.messages)) {
          for (let orderIndex = 0; orderIndex < conv.messages.length; orderIndex++) {
            const msg = conv.messages[orderIndex];
            
            // Map role: 'user' -> 'human', 'assistant' -> 'ai'
            let role: 'human' | 'ai' = 'human';
            if (msg.role === 'user') role = 'human';
            else if (msg.role === 'assistant') role = 'ai';
            else if (msg.role === 'human' || msg.role === 'ai') role = msg.role;

            const newMessage = {
              id: generateMessageId(),
              sessionId: newSessionId,
              role,
              content: msg.content || '',
              orderIndex,
              createdAt: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              isComplete: true,
              streamSequence: 0,
            };

            await db.insert(messages).values(newMessage);
            totalMessages++;
          }
        }

        imported++;
      } catch (error) {
        const errorMsg = `Failed to import conversation: ${conv.title || 'Unknown'}`;
        errors.push(errorMsg);
        console.error(errorMsg, error);
      }
    }

    const response = {
      success: errors.length === 0,
      imported: {
        conversations: imported,
        messages: totalMessages
      },
      errors: errors.length > 0 ? errors : null
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error importing conversations:', error);
    return NextResponse.json({ 
      error: 'Failed to import conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
