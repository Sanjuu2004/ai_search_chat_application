<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  
</head>
<body>

<h1>AI Search Chat with PDF Citation Viewer</h1>
<h2>link:https://good-armadillo-446.convex.app/</h2>

<h2>Overview</h2>
<p>
This project implements a Perplexity-style AI search chat application focused on
<strong>real-time streaming, explainability, and source transparency</strong>.
Users can ask questions through a clean, centered chat interface and receive AI-generated
responses that stream incrementally instead of appearing all at once.
</p>

<p>
Alongside the generated text, the system displays intermediate tool execution steps
such as document searching and content analysis, providing clear visibility into how
responses are formed. Inline citations appear directly within the response, with
corresponding source cards shown below each message for traceability.
</p>

<p>
A core feature of the application is the interactive PDF citation viewer, which allows
users to open cited documents, automatically navigate to the referenced section, and
verify information directly from the source. The project emphasizes clean architecture,
reliability, and thoughtful UI/UX design over unnecessary complexity.
</p>

<hr />

<h2>Key Features</h2>

<h3>Real-Time Streaming Chat</h3>
<ul>
  <li>Incremental AI response streaming using Server-Sent Events (SSE)</li>
  <li>Typing indicators and progressive text rendering</li>
  <li>Visible tool execution steps during response generation</li>
  <li>Structured streaming of text, tool steps, citations, and completion events</li>
</ul>

<h3>Transparent Citation System</h3>
<ul>
  <li>Inline numbered citations embedded directly within responses</li>
  <li>Source cards displayed below each message with document metadata</li>
  <li>One-click navigation from citation to original PDF source</li>
  <li>Clear traceability of all referenced content</li>
</ul>

<h3>Interactive PDF Viewer</h3>
<ul>
  <li>Smooth animated transition from chat view to document view</li>
  <li>Automatic scrolling and highlighting of cited sections</li>
  <li>Page navigation, zoom controls, and in-document text search</li>
  <li>Split-view layout on desktop and full-screen mode on mobile</li>
</ul>

<h3>Document Management</h3>
<ul>
  <li>Support for uploading PDF documents</li>
  <li>File validation for type and size</li>
  <li>Persistent document listing with metadata</li>
  <li>Uploaded documents available for citation and reference</li>
</ul>

<h3>User Interface and Experience</h3>
<ul>
  <li>Minimal, Perplexity-inspired design</li>
  <li>Light theme by default with optional dark mode toggle</li>
  <li>Smooth transitions and responsive layout</li>
  <li>Clear loading, streaming, and error states</li>
</ul>

<hr />

<h2>System Architecture</h2>

<h3>Frontend</h3>
<ul>
  <li>Built with a modern React-based setup using TypeScript</li>
  <li>Event-driven UI that reacts to streamed backend events</li>
  <li>Global state management for chat history, streaming state, and PDF viewer</li>
  <li>Tailwind CSS for styling and consistent theming</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Asynchronous API design</li>
  <li>In-memory queue for managing streaming jobs</li>
  <li>Server-Sent Events for real-time updates</li>
  <li>Structured event protocol for predictable frontend rendering</li>
  <li>PDF parsing and page-level text mapping</li>
</ul>

<hr />

<h2>Streaming Protocol</h2>
<p>
Instead of returning a single response payload, the backend streams structured events
over time. Each event includes a type and payload, allowing the frontend to progressively
render content and update the UI in real time.
</p>

<ul>
  <li><strong>text</strong> – incremental response content</li>
  <li><strong>tool_start / tool_end</strong> – processing steps</li>
  <li><strong>citation</strong> – document reference and location</li>
  <li><strong>done</strong> – response completion</li>
  <li><strong>error</strong> – graceful failure handling</li>
</ul>

<hr />

<h2>Project Structure</h2>

<pre style="
background-color:#0f172a;
color:#e5e7eb;
padding:16px;
border-radius:8px;
overflow-x:auto;
font-size:14px;
line-height:1.5;
">
ai_search_chat_application/
│
├── .env.local
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── README.md
├── setup.mjs
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
│
├── .cursor/
│   └── rules/
│       └── convex_rules.mdc
│
├── convex/
│   ├── auth.config.ts
│   ├── auth.ts
│   ├── chat.ts
│   ├── files.ts
│   ├── http.ts
│   ├── router.ts
│   ├── schema.ts
│   ├── tsconfig.json
│   │
│   └── _generated/
│       ├── api.d.ts
│       ├── api.js
│       ├── dataModel.d.ts
│       ├── server.d.ts
│       └── server.js
│
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── SignInForm.tsx
    ├── SignOutButton.tsx
    ├── vite-env.d.ts
    │
    ├── components/
    │   ├── ChatInput.tsx
    │   ├── ChatInterface.tsx
    │   ├── CitationBadge.tsx
    │   ├── DocumentList.tsx
    │   ├── FileUpload.tsx
    │   ├── Message.tsx
    │   ├── MessageList.tsx
    │   ├── PdfViewer.tsx
    │   ├── SourceCard.tsx
    │   ├── StreamingText.tsx
    │   ├── ThemeProvider.tsx
    │   ├── ThemeToggle.tsx
    │   └── ToolSteps.tsx
    │
    └── lib/
        └── utils.ts
</pre>

<hr />

<h2>Design Decisions and Trade-offs</h2>
<ul>
  <li>Streaming architecture was prioritized over model complexity.</li>
  <li>Structured events were used to keep frontend logic predictable and maintainable.</li>
  <li>In-memory queuing was chosen to reduce infrastructure overhead.</li>
  <li>The focus was placed on explainability, UI clarity, and user trust.</li>
</ul>

<hr />

<h2>What This Project Demonstrates</h2>
<ul>
  <li>Real-time streaming system design</li>
  <li>Event-driven frontend architecture</li>
  <li>Asynchronous backend processing</li>
  <li>Explainable AI interfaces with source grounding</li>
  <li>Clean, production-ready project structure</li>
</ul>

<hr />

<h2>Author</h2>
<p><strong>Sanju K</strong></p>

</body>
</html>
