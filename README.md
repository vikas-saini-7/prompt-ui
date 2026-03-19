# Prompt UI

An AI-powered web application for generating and previewing React components using multiple LLM providers (OpenAI, Claude, Groq).

## Overview

Prompt UI is a Next.js-based chat interface that leverages Large Language Models to generate React component code with live preview capabilities. Users can interact with different AI models, manage conversation history, and customize their experience through user settings.

## Key Features

- **Multi-Provider LLM Support**: Integrated with OpenAI, Anthropic (Claude), and Groq for flexible AI interactions
- **Chat Interface**: Real-time conversation management with persistent conversation history
- **Component Generation**: Generate React component code from natural language prompts
- **Live Preview**: View generated components in real-time within the application
- **User Authentication**: Secure login/signup with NextAuth and MongoDB
- **Conversation Management**: Create, view, and delete conversations with message persistence
- **User Profiles & Settings**: Personalized user experience with configurable preferences
- **Syntax Highlighting**: Enhanced code display with language-specific syntax highlighting

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth with MongoDB Adapter
- **AI Integration**: OpenAI, Anthropic, Groq APIs
- **UI Components**: Radix UI, Lucide React, Phosphor Icons
- **Code Rendering**: Prism.js, React Live, Framer Motion

## Project Structure

```
src/
├── app/              # Next.js app directory with routes and layouts
├── components/       # React components (chat, preview, navbar, etc.)
├── contexts/         # React context for state management (chat, profile, UI, toast)
├── hooks/            # Custom React hooks (useChat, useProfile, useUI, useToast)
├── lib/              # Utility functions, DB models, LLM provider implementations
├── config/           # Application and model configurations
├── types/            # TypeScript type definitions
└── actions/          # Server actions for backend operations
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Environment variables for LLM API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY)
- MongoDB connection string (MONGODB_URI)
- NextAuth secret (NEXTAUTH_SECRET)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with required API keys and MongoDB URI

# Run development server
npm run dev

# Build for production
npm build
npm start
```

The application will be available at `http://localhost:3000`

## Environment Variables

Required environment variables in `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GROQ_API_KEY=your-groq-api-key
```

## Core Features Explained

### Chat System

- Real-time conversation with AI models
- Message streaming for better UX
- Conversation persistence in MongoDB
- Message history per conversation

### Code Generation & Preview

- Generate React components from natural language
- Live preview panel to render generated components
- Syntax-highlighted code display
- Component code execution in sandboxed environment

### User System

- User registration and authentication
- Profile management
- User-specific settings and preferences
- Conversation ownership and isolation

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## License

MIT
