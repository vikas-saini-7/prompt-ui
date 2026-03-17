# Architecture Documentation

## Overview

Your application now follows a scalable, modular architecture designed for easy backend integration and state management. The codebase is organized with proper separation of concerns.

## Directory Structure

```
src/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Root page with providers
│   └── home-content.tsx         # Main content logic
├── lib/
│   ├── api/
│   │   └── api-service.ts       # Abstract API service layer
│   ├── contexts/
│   │   ├── chat-context.tsx     # Chat state management
│   │   └── ui-context.tsx       # UI state management
│   ├── hooks/
│   │   ├── useChat.ts           # Hook for chat context
│   │   ├── useUI.ts             # Hook for UI context
│   │   └── index.ts             # Export all hooks
│   ├── constants.ts             # App-wide constants
│   ├── mock-data.ts             # Mock data for development
│   └── utils.ts                 # Utility functions
├── components/
│   ├── common/                  # Reusable components
│   │   ├── app-navbar.tsx
│   │   ├── chat-container.tsx
│   │   ├── chat-message.tsx
│   │   ├── code-block.tsx
│   │   ├── empty-state.tsx
│   │   ├── loader.tsx
│   │   ├── preview-panel.tsx
│   │   ├── prompt-input.tsx
│   │   └── sidebar.tsx
│   └── ui/                      # Shadcn UI components (don't modify)
└── types/
    └── index.ts                 # TypeScript type definitions
```

## State Management

### Chat Context (`lib/contexts/chat-context.tsx`)

Manages all chat-related state:

- `messages` - Array of chat messages
- `isLoading` - Loading state for API calls
- `selectedCode` - Currently selected code to display
- `error` - Error messages
- `selectedModel` - Currently selected AI model

**Key Methods:**

- `generateComponent(prompt)` - Generate a component from prompt
- `addMessage(message)` - Add single message
- `addMessages(messages)` - Add multiple messages
- `clearMessages()` - Clear all messages
- `saveConversation()` - Save current conversation

### UI Context (`lib/contexts/ui-context.tsx`)

Manages UI state:

- `sidebarOpen` - Sidebar visibility
- `showSettings` - Settings modal state
- `theme` - Current theme (dark/light)

## Using Hooks

### In Components

```tsx
"use client";

import { useChat } from "@/lib/hooks/useChat";
import { useUI } from "@/lib/hooks/useUI";

export default function MyComponent() {
  const { messages, isLoading, generateComponent } = useChat();
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    // Your component JSX
  );
}
```

## API Service Layer (`lib/api/api-service.ts`)

The API service is a singleton that handles all API calls. It currently uses mock data but is configured to easily switch to real backend calls.

### Configuration

```tsx
import { apiService } from "@/lib/api/api-service";

// Set custom API endpoint
apiService.setBaseURL("https://your-api.com");

// Set custom timeout
apiService.setTimeout(60000);
```

### Methods

```tsx
// Generate component
const response = await apiService.generateComponent(prompt, modelId);

// Get conversations
const conversations = await apiService.getConversations();

// Save conversation
const id = await apiService.saveConversation(messages);
```

## Components Guide

### Reusable Components

All components in `components/common/` accept props and don't manage their own state (except for UI-specific state like dropdowns).

#### AppNavbar

```tsx
<AppNavbar
  onToggleSidebar={handleToggle}
  onSettingsClick={handleSettings}
  title="Custom Title"
  subtitle="Custom Subtitle"
/>
```

#### PromptInput

```tsx
<PromptInput
  onSubmit={handleSubmit}
  onClear={handleClear}
  isLoading={isLoading}
  disabled={false}
  selectedModel={selectedModel}
  onModelChange={handleModelChange}
  models={MODELS}
  options={INPUT_OPTIONS}
/>
```

#### Sidebar

```tsx
<Sidebar
  isOpen={sidebarOpen}
  onClose={handleClose}
  onNewChat={handleNewChat}
  messages={messages}
  conversations={conversations}
  onSelectConversation={handleSelect}
  title="History"
  maxHistoryItems={5}
/>
```

#### EmptyState

```tsx
<EmptyState
  title="No Messages"
  description="Start a new conversation"
  icon={CustomIcon}
/>
```

#### ChatContainer

```tsx
<ChatContainer messages={messages} isLoading={isLoading} />
```

#### PreviewPanel

```tsx
<PreviewPanel code={selectedCode} isLoading={isLoading} />
```

## Constants (`lib/constants.ts`)

Centralized configuration:

```tsx
export const MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  // ...
];

export const INPUT_OPTIONS = [
  { id: "upload", label: "Upload File", icon: Upload },
  // ...
];

export const THEME = {
  primary: "#00E87B",
  background: "#0F0F0F",
  // ...
};
```

## Backend Integration

### Step 1: Update API Service

```tsx
// lib/api/api-service.ts

apiService.setBaseURL(process.env.NEXT_PUBLIC_API_URL);

// Your endpoints will be called instead of mocks
```

### Step 2: Connect to Backend

The `generateComponent` method expects this response structure:

```typescript
{
  code: string;
  description?: string;
}
```

### Step 3: Handle Errors

Errors are wrapped in `APIError`:

```typescript
{
  message: string;
  code?: string;
}
```

## Adding New Features

### 1. Add State to Context

```tsx
// lib/contexts/chat-context.tsx
interface ChatContextType {
  // ... existing
  newFeature: string;
  setNewFeature: (value: string) => void;
}
```

### 2. Use in Component

```tsx
const { newFeature, setNewFeature } = useChat();
```

### 3. Create Custom Hook (optional)

```tsx
// lib/hooks/useNewFeature.ts
export function useNewFeature() {
  const { newFeature } = useChat();
  return newFeature;
}
```

## Best Practices

1. **Use Contexts** - For global state that multiple components need
2. **Props for Local State** - Components should accept data via props
3. **Custom Hooks** - Extract reusable logic into custom hooks
4. **Type Safety** - Always define Props interfaces
5. **API Layer** - All API calls go through `apiService`
6. **Constants** - Use `constants.ts` for hard-coded values
7. **Modular Components** - Each component should have a single responsibility

## Testing Components

Since components don't manage their own state (except dropdowns), they're easy to test:

```tsx
// Example test
it("renders with provided props", () => {
  render(<ChatContainer messages={mockMessages} isLoading={false} />);
  // assertions...
});
```

## Performance Considerations

1. **Context Splitting** - Separate contexts prevent unnecessary re-renders
2. **Memoization** - Components use useMemo for expensive operations
3. **Lazy Loading** - Code splitting happens at route level
4. **API Caching** - Can be added to apiService

## Migration from Props to Context

If you need to convert prop drilling to context:

1. Create context for the state
2. Create context provider
3. Replace props with context hook usage
4. Update component signatures

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_TIMEOUT=30000
```

## Troubleshooting

### "useChat must be used within ChatProvider"

- Ensure `<ChatProvider>` wraps your component tree
- Check `app/page.tsx` for provider setup

### Context not updating

- Verify you're using the exported hook, not creating context directly
- Check that context callbacks are fired

### API calls not working

- Verify `NEXT_PUBLIC_API_URL` is set
- Check network tab in browser DevTools
