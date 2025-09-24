import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

// Types for our JSON storage
export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolCalls?: any[];
}

export interface StoredConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
}

export interface ConversationIndex {
  conversations: Array<{
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
    lastMessage: string;
    preview: string;
  }>;
  lastUpdated: string;
}

// Storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const CONVERSATIONS_DIR = path.join(DATA_DIR, 'conversations');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONVERSATIONS_DIR)) {
    fs.mkdirSync(CONVERSATIONS_DIR, { recursive: true });
  }
}

// Load conversation index
export function loadIndex(): ConversationIndex {
  ensureDirectories();
  
  if (!fs.existsSync(INDEX_FILE)) {
    const emptyIndex: ConversationIndex = {
      conversations: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(INDEX_FILE, JSON.stringify(emptyIndex, null, 2));
    return emptyIndex;
  }
  
  try {
    const data = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading index:', error);
    return { conversations: [], lastUpdated: new Date().toISOString() };
  }
}

// Save conversation index
export function saveIndex(index: ConversationIndex) {
  ensureDirectories();
  index.lastUpdated = new Date().toISOString();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

// Load a specific conversation
export function loadConversation(id: string): StoredConversation | null {
  const filePath = path.join(CONVERSATIONS_DIR, `${id}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading conversation ${id}:`, error);
    return null;
  }
}

// Save a conversation
export function saveConversation(conversation: StoredConversation) {
  ensureDirectories();
  
  const filePath = path.join(CONVERSATIONS_DIR, `${conversation.id}.json`);
  conversation.updatedAt = new Date().toISOString();
  
  fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
  
  // Update index
  const index = loadIndex();
  const existingIndex = index.conversations.findIndex(c => c.id === conversation.id);
  
  const lastMessage = conversation.messages.length > 0 
    ? conversation.messages[conversation.messages.length - 1].content 
    : '';
  
  const indexEntry = {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messageCount: conversation.messages.length,
    lastMessage: lastMessage.substring(0, 100),
    preview: lastMessage.substring(0, 100) + (lastMessage.length > 100 ? '...' : '') || 'No messages'
  };
  
  if (existingIndex >= 0) {
    index.conversations[existingIndex] = indexEntry;
  } else {
    index.conversations.unshift(indexEntry); // Add to beginning (newest first)
  }
  
  // Sort by updatedAt (newest first)
  index.conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  saveIndex(index);
}

// Delete a conversation
export function deleteConversation(id: string) {
  const filePath = path.join(CONVERSATIONS_DIR, `${id}.json`);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  // Update index
  const index = loadIndex();
  index.conversations = index.conversations.filter(c => c.id !== id);
  saveIndex(index);
}

// Create a new conversation
export function createConversation(title: string, firstMessage?: StoredMessage): StoredConversation {
  const now = new Date().toISOString();
  const conversation: StoredConversation = {
    id: nanoid(),
    title: title || 'New Conversation',
    createdAt: now,
    updatedAt: now,
    messages: firstMessage ? [firstMessage] : []
  };
  
  saveConversation(conversation);
  return conversation;
}

// Add message to conversation
export function addMessageToConversation(conversationId: string, message: StoredMessage) {
  const conversation = loadConversation(conversationId);
  if (!conversation) {
    throw new Error(`Conversation ${conversationId} not found`);
  }
  
  // Check if message already exists (avoid duplicates)
  const existingMessage = conversation.messages.find(m => m.id === message.id);
  if (existingMessage) {
    return conversation;
  }
  
  conversation.messages.push(message);
  saveConversation(conversation);
  return conversation;
}

// Update conversation title
export function updateConversationTitle(id: string, title: string) {
  const conversation = loadConversation(id);
  if (!conversation) {
    throw new Error(`Conversation ${id} not found`);
  }
  
  conversation.title = title;
  saveConversation(conversation);
  return conversation;
}

// Search conversations
export function searchConversations(query: string): ConversationIndex['conversations'] {
  const index = loadIndex();
  const lowerQuery = query.toLowerCase();
  
  return index.conversations.filter(conv => 
    conv.title.toLowerCase().includes(lowerQuery) ||
    conv.preview.toLowerCase().includes(lowerQuery)
  );
}

// Get all conversations for export
export function getAllConversationsForExport(): StoredConversation[] {
  const index = loadIndex();
  return index.conversations.map(meta => loadConversation(meta.id)).filter(Boolean) as StoredConversation[];
}

// Import conversations from JSON
export function importConversations(conversations: StoredConversation[]): { imported: number; errors: string[] } {
  let imported = 0;
  const errors: string[] = [];
  
  for (const conv of conversations) {
    try {
      // Generate new ID to avoid conflicts
      const newConv = {
        ...conv,
        id: nanoid(),
        createdAt: conv.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      saveConversation(newConv);
      imported++;
    } catch (error) {
      errors.push(`Failed to import conversation: ${conv.title || 'Unknown'}`);
    }
  }
  
  return { imported, errors };
}
