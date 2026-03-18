import { NextRequest, NextResponse } from 'next/server';

// Lightweight lesson assistant handler.
// POST: accepts { text, lessonContext? } and returns a JSON assistant message.
// GET: returns a small list of recent conversations (stubbed)

export async function GET() {
  return NextResponse.json({ conversations: [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = (body?.text ?? '').toString();
    const lesson: any = body?.lessonContext ?? null;

    // Very small, local "assistant" logic to personalize responses using
    // available lesson context. This is intentionally simple — a production
    // implementation should call an LLM provider and follow safety/privacy rules.

    let reply = '';

    if (!text) {
      reply = "Hi — what would you like help with on this lesson? Ask about the learning objectives, examples, or quizzes.";
    } else if (lesson && Array.isArray(lesson.learning_objectives) && /objective|learn|goal/i.test(text)) {
      reply = `Learning objectives:\n${lesson.learning_objectives.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}`;
    } else if (lesson && /example|sample/i.test(text)) {
      // Try to provide a short example using lesson title or content if available
      const title = lesson.title ?? 'this lesson';
      const snippet = (lesson.content || lesson.description || '').toString().slice(0, 300);
      reply = `Here's a short example related to ${title}:\n${snippet ? snippet : 'No detailed content available to create an example. Try asking for a summary or clarification.'}`;
    } else if (lesson && /summary|summar/i.test(text)) {
      const snippet = (lesson.content || lesson.description || lesson.learning_objectives || '').toString();
      reply = snippet
        ? `Summary:\n${snippet.slice(0, 800)}`
        : "I don't have a description for this lesson. Try asking a specific question or request an example.";
    } else {
      // Fallback: echo intent + short guidance
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
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to handle request' }, { status: 500 });
  }
}
