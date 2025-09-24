import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

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
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎯</span>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Bonus Points: Indonesian Holiday Tool Calling
                  </p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    Implement tool calling with special cards for Indonesian holiday information. Knowledge base includes 20+ holidays with rich data.
                  </p>
                  
                  {/* Preview of what tool calling cards would look like */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-orange-800 dark:text-orange-200">Tool Calling Card Examples:</p>
                    
                    {/* Mini preview cards */}
                    <div className="grid gap-2">
                      <div className="bg-white dark:bg-gray-900 p-2 rounded border-l-2 border-l-blue-500">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium">Independence Day</p>
                          <Badge className="h-4 text-xs bg-blue-100 text-blue-800">national</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Hari Kemerdekaan • August 17th</p>
                        <p className="text-xs text-muted-foreground mt-1">Celebrates Indonesia's declaration of independence...</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-900 p-2 rounded border-l-2 border-l-green-500">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium">Religious Holidays (5)</p>
                          <Badge className="h-4 text-xs bg-green-100 text-green-800">religious</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Eid al-Fitr, Eid al-Adha, Christmas Day...</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-900 p-2 rounded border-l-2 border-l-purple-500">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium">Holiday Statistics</p>
                          <Badge className="h-4 text-xs bg-purple-100 text-purple-800">stats</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Total: 20+ holidays • Public: 15 • Types: 4</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      <span className="font-medium">Available tools:</span> getHolidayInfo, searchHolidays, getHolidaysByType, getHolidayStats, and more
                    </p>
                  </div>
                </div>
              </div>
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
              <Badge>SQLite + Drizzle</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
