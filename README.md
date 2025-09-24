# 🇮🇩 Indonesian Holiday Assistant

An intelligent chat application that provides comprehensive information about Indonesian holidays, traditions, and cultural celebrations. Built with Next.js 14, AI SDK v5, and a clean JSON file-based storage system.

## ✨ Features

### 🤖 **Intelligent Chat System**

- **AI-powered conversations** about Indonesian holidays and culture  
- **Real-time streaming responses** with AI SDK v5
- **Tool integration** - Get detailed holiday information, search holidays, view statistics
- **Professional chat interface** with role-based message styling
- **Auto-scroll** to latest messages with smooth animations

### 💾 **Persistent Memory System**

- **JSON file-based storage** - No database setup required!
- **Automatic message saving** - Never lose your conversations
- **Real-time persistence** - Messages saved as you chat
- **Tool call preservation** - AI responses with holiday data preserved perfectly
- **Simple backup** - Just copy the `data/` folder

### 🗂️ **Conversation Management**

- **Professional sidebar** with full conversation history
- **Auto-generated titles** from first user message
- **Real-time search** - Find conversations by title or content
- **Inline editing** - Rename conversations with click-to-edit
- **Smart sorting** - Most recent conversations first
- **Message previews** - See last message and count per conversation
- **Delete with confirmation** - Safe conversation removal

### 📊 **Export & Import System**

- **JSON Export** - Download individual chats or all conversations
- **Comprehensive format** - Includes metadata, timestamps, tool calls
- **Import system** - Restore conversations from JSON files
- **Backup & restore** - Full data portability
- **Version compatibility** - Built-in format versioning

### 🎨 **User Experience**

- **Responsive design** - Works perfectly on desktop and mobile
- **Collapsible sidebar** - More screen space when needed
- **Loading states** - Clear feedback during AI responses
- **Error handling** - Graceful failures with user feedback
- **Keyboard shortcuts ready** - Ctrl+K search, Ctrl+N new chat
- **Professional styling** - Modern UI with Tailwind CSS

### 🏛️ **Holiday Information Features**

- **Detailed holiday information** - Names in English and Indonesian
- **Holiday search** - Find holidays by keywords or type
- **Statistics dashboard** - Overview of holidays by type
- **Beautiful cards** - Rich formatting for holiday details
- **Cultural context** - Significance, traditions, and customs
- **Public holiday indicators** - Clear marking of official holidays

## 🏗️ **Technical Architecture**

### **Frontend**

- **Next.js 14** with App Router
- **TypeScript** throughout for type safety
- **Tailwind CSS** for styling
- **AI SDK v5** for chat functionality
- **Radix UI** components for accessibility

### **Backend**

- **API Routes** for conversation management
- **JSON file storage** in `data/` directory
- **Real-time persistence** with atomic file operations
- **RESTful endpoints** for CRUD operations

### **Storage Structure**

```
data/
├── index.json                 # Master conversation index
└── conversations/
    ├── conv_abc123.json      # Individual conversation files
    ├── conv_def456.json
    └── ...
```

### **Conversation File Format**

```json
{
  "id": "conv_abc123",
  "title": "Indonesian Holiday Questions",
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T11:15:00Z",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "What are the main holidays in Indonesia?",
      "timestamp": "2024-01-20T10:30:00Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "Indonesia celebrates many beautiful holidays...",
      "timestamp": "2024-01-20T10:30:15Z",
      "toolCalls": [...] // Preserved AI tool usage
    }
  ]
}
```

## 🚀 **Getting Started**

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenRouter API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ai-interview
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Add your OpenRouter API key
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000/chat](http://localhost:3000/chat)

## 📖 **Usage**

### **Starting Conversations**

1. Navigate to the chat page
2. Type your question about Indonesian holidays
3. Conversations are automatically created and saved

### **Managing Conversations**

- **Browse history**: Use the sidebar to see all your conversations
- **Search conversations**: Type in the search box to filter by title/content
- **Rename conversations**: Click the edit icon next to any conversation title
- **Delete conversations**: Click the trash icon (with confirmation)
- **New conversation**: Click "New Conversation" or start typing a new message

### **Export & Import**

- **Export single chat**: Click "Export Chat" in the header when viewing a conversation
- **Export all chats**: Click "Export All Chats" in the sidebar
- **Import chats**: Click "Import Chats" and select a JSON file

### **Holiday Information**

Ask questions like:

- "What are the main holidays in Indonesia?"
- "Tell me about Eid celebrations"
- "Show me statistics about Indonesian holidays"
- "What holidays are celebrated in Bali?"

## 🛠️ **API Endpoints**

- `GET /api/conversations` - List all conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get conversation with messages
- `PATCH /api/conversations/[id]` - Update conversation (rename)
- `DELETE /api/conversations/[id]` - Delete conversation
- `POST /api/conversations/[id]/messages` - Add message to conversation
- `GET /api/export` - Export conversations as JSON
- `POST /api/import` - Import conversations from JSON
- `POST /api/chat` - Main chat endpoint with AI integration

## 📁 **Project Structure**

```
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── chat/           # Chat page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── ChatSidebar.tsx # Conversation management
│   │   └── ui/             # UI components
│   └── lib/
│       ├── storage/        # JSON file operations
│       └── data/           # Holiday data
├── data/                   # Conversation storage
└── public/                 # Static assets
```

## 🎯 **Key Features Breakdown**

### **Conversation Persistence**

- All messages automatically saved to JSON files
- No database setup or migrations required
- Human-readable storage format
- Easy backup and migration

### **Professional Chat Interface**

- Real-time streaming responses
- Professional message bubbles
- Loading indicators and smooth animations
- Mobile-responsive design

### **Advanced Conversation Management**

- Sidebar with search and filtering
- Rename conversations inline
- Delete with confirmation prompts
- Sort by most recent activity

### **Data Export & Import**

- Download conversations as JSON
- Import conversations from JSON files
- Full backup and restore capabilities
- Version-compatible format

### **Indonesian Holiday Intelligence**

- Comprehensive holiday database
- Search by name, type, or keywords
- Detailed information cards
- Cultural context and traditions

## 🚦 **Development**

### **File Storage System**

The application uses a simple JSON file-based storage system:

- `data/index.json` - Master index of all conversations
- `data/conversations/` - Individual conversation JSON files
- Atomic file operations prevent data corruption
- Human-readable format for debugging

### **Adding New Features**

1. **API endpoints**: Add routes in `src/app/api/`
2. **Storage operations**: Extend `src/lib/storage/json-store.ts`
3. **UI components**: Create components in `src/components/`
4. **Holiday data**: Update `src/lib/data/indonesian-holidays.ts`

## 📄 **License**

MIT License - feel free to use this project as a foundation for your own AI chat applications!

---

## 🎥 **Demo Video**

[View Demo](https://www.loom.com/share/d16fdb6e3fb44a9dbc9ddf125888ee31?sid=52979086-920a-4c00-a365-2cdf991a74e2)

---

**Built with ❤️ for Indonesian culture and holidays**
