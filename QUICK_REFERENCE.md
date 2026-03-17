# Quick Reference Guide

## 🎯 Using Hooks

### useChat()

Access and manage chat state:

```tsx
import { useChat } from "@/lib/hooks";

export default function Component() {
  const {
    // State
    messages,           // ChatMessage[]
    isLoading,         // boolean
    selectedCode,      // string | undefined
    error,             // string | undefined
    selectedModel,     // string

    // Actions
    addMessage,        // (message: ChatMessage) => void
    addMessages,       // (messages: ChatMessage[]) => void
    clearMessages,     // () => void
    setSelectedCode,   // (code?: string) => void
    setError,          // (error?: string) => void
    setSelectedModel,  // (model: string) => void

    // Async Operations
    generateComponent, // (prompt: string) => Promise<void>
    saveConversation,  // () => Promise<string | null>
  } = useChat();

  return (
    // Your JSX
  );
}
```

### useUI()

Access and manage UI state:

```tsx
import { useUI } from "@/lib/hooks";

export default function Component() {
  const {
    sidebarOpen,      // boolean
    setSidebarOpen,   // (open: boolean) => void
    toggleSidebar,    // () => void
    showSettings,     // boolean
    setShowSettings,  // (show: boolean) => void
    theme,            // "dark" | "light"
    setTheme,         // (theme: "dark" | "light") => void
  } = useUI();

  return (
    // Your JSX
  );
}
```

## 🔌 API Service

### Setup

```tsx
import { apiService } from "@/lib/api/api-service";

// Configure endpoint
apiService.setBaseURL("https://api.example.com");

// Configure timeout
apiService.setTimeout(30000);
```

### Usage

```tsx
// Generate component
try {
  const response = await apiService.generateComponent(prompt, "gpt-4");
  console.log(response.code);
} catch (error) {
  console.error(error.message);
}

// Get conversations
const conversations = await apiService.getConversations();

// Save conversation
const conversationId = await apiService.saveConversation(messages);
```

## 📦 Using Context in Components

### Option 1: Use Hooks (Recommended)

```tsx
"use client";

import { useChat, useUI } from "@/lib/hooks";

export default function MyComponent() {
  const { messages } = useChat();
  const { sidebarOpen } = useUI();

  return <div>{messages.length} messages</div>;
}
```

### Option 2: Use Context Directly

```tsx
"use client";

import { useContext } from "react";
import { ChatContext } from "@/lib/contexts/chat-context";

export default function MyComponent() {
  const chatContext = useContext(ChatContext);
  if (!chatContext) throw new Error("Must be within ChatProvider");

  return <div>{chatContext.messages.length} messages</div>;
}
```

## 🎨 Component Patterns

### Reusable Component Template

```tsx
"use client";

interface Props {
  // Data props
  data: any;
  isLoading?: boolean;

  // Event handlers
  onSubmit?: (value: any) => void;
  onClose?: () => void;

  // Customization
  title?: string;
  variant?: "primary" | "secondary";
}

export default function MyComponent({
  data,
  isLoading = false,
  onSubmit,
  onClose,
  title = "Default Title",
  variant = "primary",
}: Props) {
  return (
    // Your JSX
  );
}
```

### Using Constants

```tsx
import { MODELS, THEME, ANIMATION_DURATION } from "@/lib/constants";

export default function Component() {
  return (
    <select defaultValue={MODELS[0].id}>
      {MODELS.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
}
```

## 🔄 Common Patterns

### Generate and Display

```tsx
export default function GeneratePanel() {
  const { generateComponent, messages, selectedCode } = useChat();

  const handleGenerate = async (prompt: string) => {
    await generateComponent(prompt);
  };

  return (
    <div>
      <input onSubmit={(e) => handleGenerate(e.target.value)} />
      <div>{selectedCode}</div>
      <div>Total messages: {messages.length}</div>
    </div>
  );
}
```

### Toggle Sidebar

```tsx
export default function Layout() {
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <>
      <button onClick={toggleSidebar}>Menu</button>
      {sidebarOpen && <Sidebar />}
    </>
  );
}
```

### Save and Display History

```tsx
export default function History() {
  const { messages, saveConversation } = useChat();

  const handleSave = async () => {
    const id = await saveConversation();
    if (id) {
      console.log("Saved: ", id);
    }
  };

  return (
    <button onClick={handleSave}>Save ({messages.length} messages)</button>
  );
}
```

## 🛡️ Error Handling

### In Components

```tsx
export default function Component() {
  const { error, setError } = useChat();

  useEffect(() => {
    if (error) {
      // Show error UI
      setTimeout(() => setError(undefined), 5000);
    }
  }, [error, setError]);

  return (
    <>
      {error && <ErrorBanner message={error} />}
      {/* Component content */}
    </>
  );
}
```

### With API Service

```tsx
try {
  const response = await apiService.generateComponent(prompt);
} catch (err) {
  // Type: APIError
  console.error(err.code, err.message);

  if (err.code === "TIMEOUT") {
    // Handle timeout
  } else if (err.code === "NETWORK_ERROR") {
    // Handle network error
  }
}
```

## 📝 TypeScript Interfaces

### ChatMessage

```tsx
interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  code?: string;
  timestamp: Date;
}
```

### Context Types

```tsx
interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  selectedCode?: string;
  error?: string;
  selectedModel: string;
  // ... methods
}

interface UIContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}
```

## 🚀 Creating a New Feature

### Step 1: Add to Chat Context

```tsx
// lib/contexts/chat-context.tsx
interface ChatContextType {
  // ... existing
  myNewFeature: string;
  setMyNewFeature: (value: string) => void;
}

// In provider
const [myNewFeature, setMyNewFeature] = useState("");
```

### Step 2: Use in Component

```tsx
const { myNewFeature, setMyNewFeature } = useChat();

setMyNewFeature("new value");
```

### Step 3: Optional - Create Custom Hook

```tsx
// lib/hooks/useMyFeature.ts
export function useMyFeature() {
  const { myNewFeature, setMyNewFeature } = useChat();
  return { myNewFeature, setMyNewFeature };
}
```

### Step 4: Export from index

```tsx
// lib/hooks/index.ts
export { useMyFeature } from "./useMyFeature";
```

## 📊 Constants Structure

```tsx
// lib/constants.ts

export const MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5", name: "GPT-3.5" },
];

export const INPUT_OPTIONS = [
  { id: "upload", label: "Upload File", icon: Upload },
  { id: "camera", label: "Camera", icon: Camera },
];

export const THEME = {
  primary: "#00E87B",
  background: "#0F0F0F",
  darkBg: "#09090B",
  border: "#27272A",
  zinc900: "#18181B",
  zinc800: "#27272A",
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const API_TIMEOUT = 30000; // 30 seconds
```

## ⚡ Performance Tips

1. **Memoize expensive components:**

   ```tsx
   import { useMemo } from "react";

   const expensiveValue = useMemo(() => {
     return complexCalculation(data);
   }, [data]);
   ```

2. **Use custom hooks to avoid re-renders:**

   ```tsx
   // Instead of useChat in multiple places
   // Extract to custom hook
   export function useChatMessages() {
     const { messages } = useChat();
     return useMemo(() => messages.filter(...), [messages]);
   }
   ```

3. **Split contexts by concern:**
   - ChatContext: Chat-related state
   - UIContext: UI-related state

---

**Last Updated:** 2024
**Version:** 1.0
**TypeScript:** Yes
**ESLint:** Configured
