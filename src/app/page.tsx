import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Mobile-First Chat Application Challenge
          </h1>
          <p className="text-muted-foreground text-lg">
            Build a scalable chat interface with AI bot integration
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">The Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              You are building a <strong>mobile-first chat application</strong> that connects users with both support agents and AI bots. The application must:
            </p>
            
            <ul className="space-y-3 list-disc list-inside text-muted-foreground">
              <li>Provide a clear and consistent chat interface with reusable components (message bubbles, avatars, menus).</li>
              <li>Handle loading states (sending, receiving, skeletons) and error states (failed sends, retries).</li>
              <li>Manage real-time updates efficiently without breaking scroll position or causing flicker.</li>
              <li>Ensure state management for chat history, input fields, and UI states is clean and maintainable.</li>
              <li>Scale to long conversations with smooth scrolling and performance optimizations.</li>
              <li>Integrate AI bot responses with formatting, context management, and backend service calls, including streaming responses.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">UI/UX</Badge>
                Design & Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Chat interface layout and message bubble design</li>
                <li>• Mobile menu types (hamburger, tab bar, slide-out drawer)</li>
                <li>• Loading states and skeleton screens</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">UX</Badge>
                User Experience Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Conversation and message organization</li>
                <li>• Error handling and retry mechanisms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Frontend</Badge>
                Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Component architecture and reusability</li>
                <li>• State management for chat history and UI states</li>
                <li>• Form handling and input validation</li>
                <li>• Real-time message updates</li>
                <li>• Performance optimization for smooth scrolling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">AI</Badge>
                Chat Bot Functionality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Bot response formatting and display</li>
                <li>• User input handling and validation</li>
                <li>• Conversation context management</li>
                <li>• Integration with AI/backend services</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Next.js 15</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Bun</Badge>
              <Badge>Vercel AI SDK v5</Badge>
              <Badge>OpenRouter API</Badge>
              <Badge>Zod v4</Badge>
              <Badge>TailwindCSS</Badge>
              <Badge>shadcn/ui</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
