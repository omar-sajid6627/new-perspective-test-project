## AI Chat Interface (Single-Page React App)

A modern, single‑page chat UI built with React and Vite. It lets you type messages, receive scripted responses (no real API calls), and control response behavior with adjustable options like response length, model choice, tone, temperature, reading level, and an include‑outline toggle. It also supports attaching files to influence the generated response.

### Objective
- Build a polished chat interface for interacting with a chatbot, customizing responses, and handling file attachments, without requiring any API keys or network calls.

### Tech Stack and Rationale
- **React + TypeScript**: Component-based UI with type safety for maintainability.
- **Vite**: Fast dev server and lean production builds.
- **Tailwind CSS**: Utility-first styling for rapid iteration and consistent design.
- **Radix UI primitives**: Accessible, composable building blocks for controls (dialog, select, slider, switch) used via the components in `src/components/ui`.
- **Framer Motion**: Smooth micro‑interactions and transitions.
- **Lucide Icons**: Crisp, lightweight icon set.
- **React Markdown + remark-gfm**: Rich rendering of AI responses including code blocks and lists.


## 1. Basic Introduction and Objective

This application is a streamlined chat interface demonstrating a typical AI assistant UX. Messages are exchanged in a single page; user inputs are processed locally to produce a scripted AI response that mimics real behavior. Users can:
- **Send messages** using a composer with Enter to send and Shift+Enter for new lines.
- **Attach files** (up to 5, 10MB each) via drag‑and‑drop or the file picker.
- **Customize responses** using an options panel (Response Length, Model Choice, Tone, Temperature, Reading Level, Include Outline).

There are no real network requests or API keys. The logic resides in `AIAgent`, which returns a response based on the message content, current options, and attachments.


## 2. Directory and File Structure

Project layout:

```text
AI Chat Interface/
  ├─ dist/                      # Production build (output of `vite build`)
  │  └─ assets/                 # Built assets
  ├─ index.html                 # Root HTML for Vite
  ├─ package.json               # Scripts and dependencies
  ├─ postcss.config.js          # PostCSS config
  ├─ public/                    # Static assets served as‑is
  ├─ src/                       # Application source
  │  ├─ App.tsx                 # Root app component and chat logic
  │  ├─ assets/                 # App images and icons
  │  ├─ components/             # Reusable UI + chat components
  │  │  ├─ FileAttachment.tsx
  │  │  ├─ MarkdownRenderer.tsx
  │  │  ├─ MessageBubble.tsx
  │  │  ├─ MessageComposer.tsx
  │  │  ├─ OptionsPanel.tsx
  │  │  └─ ui/                  # Radix-based primitives (button, select, etc.)
  │  ├─ index.css               # Global styles (Tailwind)
  │  ├─ lib/                    # App logic and utilities
  │  │  ├─ aiAgent.ts           # Scripted response generator
  │  │  └─ utils.ts             # Helpers (formatting, classNames)
  │  ├─ main.tsx                # App bootstrap (React root)
  │  └─ types/                  # Shared TypeScript types
  │     └─ index.ts
  ├─ tailwind.config.js         # Tailwind config
  ├─ tsconfig*.json             # TypeScript configs
  ├─ vite.config.ts             # Vite configuration
  └─ yarn.lock                  # Locked dependency versions (Yarn)
```

Key directories and files:

| Path | Purpose |
| ---- | ------- |
| `src/App.tsx` | Top-level component: message state, typing indicator, options panel wiring, and response flow. |
| `src/components/MessageComposer.tsx` | Input box, Enter-to-send, Shift+Enter for newline, drag‑and‑drop and picker for attachments. |
| `src/components/MessageBubble.tsx` | Renders user and AI bubbles; AI content via `MarkdownRenderer`. |
| `src/components/OptionsPanel.tsx` | Dialog with controls for response length, model, tone, temperature, reading level, and include outline. |
| `src/components/FileAttachment.tsx` | Small pill UI for attached files with size and remove action. |
| `src/components/MarkdownRenderer.tsx` | GFM‑aware Markdown rendering with inline/blocked code styling. |
| `src/components/ui/*` | Radix‑styled building blocks (button, select, slider, switch, dialog, etc.). |
| `src/lib/aiAgent.ts` | Scripted response generator: infers style and composes content based on options and attachments. |
| `src/lib/utils.ts` | Utilities (file size/time formatting, class name merging). |
| `src/types/index.ts` | Shared types: `Message`, `ChatOptions`, `AIResponse`, `FileAttachment`. |
| `vite.config.ts` | Vite config with React plugin. |
| `tailwind.config.js`, `postcss.config.js` | Tailwind and PostCSS configuration. |


## 3. Local Setup Guide

### Requirements
- **Node.js 18+** (LTS recommended)
- npm or Yarn

No environment variables are required. All responses are generated locally.

### Install and Run
1. Install dependencies
2. Start the dev server
3. Open the app at the printed local URL

Common commands:

| Command | Description |
| ------- | ----------- |
| `npm install` | Installs project dependencies (use `yarn install` if you prefer Yarn). |
| `npm run dev` | Starts the development server with Vite. |
| `npm run build` | Builds the production app to `dist/`. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs ESLint on the codebase. |

Yarn equivalents: `yarn`, `yarn dev`, `yarn build`, `yarn preview`, `yarn lint`.


## 4. Basic Flow of the Application

### How it works
1. `main.tsx` mounts `App` into `#root`.
2. `App` initializes with a friendly AI greeting in `messages` and renders:
   - A header with an online indicator and the `OptionsPanel`.
   - A scrollable conversation area of `MessageBubble` components.
   - The `MessageComposer` at the bottom for input and attachments.
3. When the user sends a message:
   - `handleSendMessage` appends the user message and enables a typing indicator.
   - After a short random delay, `AIAgent.generateResponse(message, options, attachments)` returns an `AIResponse`.
   - The AI message is appended, typing indicator is cleared, and the list auto‑scrolls.
4. AI messages render through `MarkdownRenderer` to support lists, code blocks, and links.

### User flow diagram

```mermaid
flowchart TD
  A[App mounts] --> B[Header + OptionsPanel]
  A --> C[Initial AI greeting in messages]
  D[User types in MessageComposer] -->|Enter or Send| E[handleSendMessage]
  E --> F[Append user message]
  E --> G[Set isTyping + small delay]
  G --> H[AIAgent.generateResponse(message, options, attachments)]
  H --> I[Append AI message; clear isTyping]
  I --> J[MessageBubble renders; AI via MarkdownRenderer]
  K[OptionsPanel changes] -->|onOptionsChange| L[setOptions in App]
  L --> H
  M[Attach files (drag/drop or picker)] --> N[attachments state]
  N --> H
```

### Component interactions and controls
- **Options affect output**:
  - **Response Length**: can bias style (e.g., short → quip, long → summary with more detail).
  - **Model Choice**: referenced in the response preamble (no backend call).
  - **Tone** and **Reading Level**: adjust phrasing and depth of the base response.
  - **Temperature**: represented as a numeric control; in a real model this would influence randomness.
  - **Include Outline**: adds a bullet outline to summary‑style responses.
- **Attachments (max 5, ≤10MB each)**: listed above the composer; their presence steers the agent toward a summary and mentions filenames.
- **Keyboard**: Enter to send, Shift+Enter for newline.


## 5. Future Enhancements

- **Real model integration**: Connect to providers (OpenAI, Anthropic, Google) with streaming tokens and error handling.
- **Streaming UI**: Render partial tokens with a live typing indicator and cancelation.
- **Multimodal content**: Support displaying and sending images, audio, and rich previews for attachments.
- **Persistence & sessions**: Save conversations locally (IndexedDB) or in a backend; allow multiple threads.
- **Advanced controls**: System prompts, top‑p, frequency/presence penalties, function/tool calling, and JSON modes.
- **Better UX/animations**: Message enter/exit transitions, auto‑scroll tuning, and reduced layout shift.
- **Accessibility (a11y)**: Improved focus management, landmarks, and ARIA for all interactive controls.
- **Internationalization**: i18n for UI and date/number formatting.
- **Testing**: Unit tests for `AIAgent` and components; E2E happy‑path flows.
- **Export/share**: Export conversation to Markdown/JSON; shareable links.
- **Theming**: Light/dark/system themes with Tailwind tokens.

---

If you plan to integrate a real API later, start by replacing `AIAgent.generateResponse` with an async call, return tokens incrementally, and keep the rest of the UI and state management intact.
