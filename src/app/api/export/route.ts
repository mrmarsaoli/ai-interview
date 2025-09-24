import { getAllConversationsForExport, loadConversation } from '@/lib/storage/json-store';
import { NextResponse } from 'next/server';

// GET /api/export - Export all conversations as JSON
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversation');

    let conversationsData;

    if (conversationId) {
      // Export single conversation
      const conversation = loadConversation(conversationId);

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      conversationsData = [conversation];
    } else {
      // Export all conversations
      conversationsData = getAllConversationsForExport();
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
