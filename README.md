# Mobile-First Chat Application Challenge

A Next.js full-stack application setup for building a mobile-first chat interface with AI bot integration.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: [Bun](https://bun.sh/) for fast package management and development
- **AI**: [Vercel AI SDK v5](https://sdk.vercel.ai/) with OpenRouter integration
- **Validation**: [Zod v4](https://zod.dev/) for runtime type checking
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components

## Challenge Overview

Build a scalable, mobile-first chat application that connects users with both support agents and AI bots, featuring:

- 📱 Mobile-first responsive design
- 💬 Reusable chat components (message bubbles, avatars, menus)
- ⚡ Real-time updates with smooth scrolling
- 🤖 AI bot integration with streaming responses
- 🔄 Loading states and error handling
- 📊 Clean state management architecture

## Getting Started

1. **Clone the repository and install dependencies:**

```bash
bun install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your OpenRouter API key from [https://openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)

3. **Run the development server:**

```bash
bun dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
