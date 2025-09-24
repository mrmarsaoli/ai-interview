import { SimpleChat } from '@/components/simple-chat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Challenge
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              AI Chat Test
            </h1>
            <p className="text-muted-foreground">
              Testing OpenRouter API integration
            </p>
          </div>
        </div>
        
        <SimpleChat />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a simple test to verify the AI integration is working.
          </p>
        </div>
      </div>
    </div>
  );
}
