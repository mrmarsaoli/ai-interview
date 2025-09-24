import { importConversations } from '@/lib/storage/json-store';
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

    const result = importConversations(importData.conversations);

    const response = {
      success: result.errors.length === 0,
      imported: {
        conversations: result.imported,
        messages: importData.conversations.reduce((sum: number, conv: any) => sum + (conv.messages?.length || 0), 0)
      },
      errors: result.errors.length > 0 ? result.errors : null
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
