import { NextRequest, NextResponse } from 'next/server';
import { withCSRFProtection } from '@/lib/csrf-middleware';

// This route can operate in two modes:
// 1. Proxy mode: forward requests to the real backend API (recommended). The
//    backend may require authentication (session cookie or token). In this
//    case set NEXT_PUBLIC_API_URL to your backend base URL (e.g. https://api.z-learn.app).
// 2. Local stub mode: if no BACKEND_URL is configured, the route will return
//    a simple, safe rule-based reply (useful for local dev without backend).

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function GET() {
  // Simple stub list of recent conversations when not proxying.
  if (!BACKEND_URL) {
    return NextResponse.json({ conversations: [] });
  }

  try {
    const res = await fetch(`${BACKEND_URL.replace(/\/$/,'')}/api/ai/lesson-assistant/`, {
      method: 'GET',
      headers: {
        // Forward cookies if present (allow backend to use session auth)
        cookie: (headersFromGlobal() as any).cookie ?? '',
      },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error proxying GET /api/ai/lesson-assistant to backend:', error);
    return NextResponse.json({ conversations: [] });
  }
}

// Helper to safely read headers — NextRequest isn't available here; we try to
// read from the global process if possible (best-effort). For POST we'll
// forward headers from the incoming request directly below.
function headersFromGlobal() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { headers } = require('next/headers');
    return headers();
  } catch {
    return {};
  }
}

async function handleProxyPost(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    if (!BACKEND_URL) {
      // Local stub behaviour (unchanged)
      const text: string = (body?.text ?? '').toString();
      const lesson: any = body?.lessonContext ?? null;
      let reply = '';

      if (!text) {
        reply = "Hi — what would you like help with on this lesson? Ask about the learning objectives, examples, or quizzes.";
      } else if (lesson && Array.isArray(lesson.learning_objectives) && /objective|learn|goal/i.test(text)) {
        reply = `Learning objectives:\n${lesson.learning_objectives.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}`;
      } else if (lesson && /example|sample/i.test(text)) {
        const title = lesson.title ?? 'this lesson';
        const snippet = (lesson.content || lesson.description || '').toString().slice(0, 300);
        reply = `Here's a short example related to ${title}:\n${snippet ? snippet : 'No detailed content available to create an example. Try asking for a summary or clarification.'}`;
      } else if (lesson && /summary|summar/i.test(text)) {
        const snippet = (lesson.content || lesson.description || lesson.learning_objectives || '').toString();
        reply = snippet
          ? `Summary:\n${snippet.slice(0, 800)}`
          : "I don't have a description for this lesson. Try asking a specific question or request an example.";
      } else {
        const short = (lesson?.description || lesson?.content || '')?.toString()?.slice(0, 240) ?? '';
        reply = `I can help with this lesson. You asked: "${text}". ${short ? `Brief lesson content: ${short}` : ''}\n\nTry asking about learning objectives, a worked example, or how the topic relates to real-world use.`;
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        message_type: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json({ message: assistantMessage });
    }

    // Proxy to backend. Forward Authorization header and cookies so backend
    // can authenticate the user (session cookie or token).
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = req.headers.get('authorization') || req.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/api/ai/lesson-assistant/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error proxying POST /api/ai/lesson-assistant to backend:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Protect mutating requests with CSRF validation (mirrors other proxy routes)
  return withCSRFProtection(request, handleProxyPost);
}
