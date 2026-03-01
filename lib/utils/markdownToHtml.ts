/**
 * Simple markdown-to-HTML for course descriptions and lesson content.
 * Escapes HTML to prevent XSS; supports headings, lists, code, bold, italic, links.
 */

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}

/**
 * Convert markdown string to safe HTML.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') return '';

  let html = escapeHtml(markdown);

  // Code blocks (fenced)
  html = html.replace(/```[\s\S]*?```/g, (block) => {
    const code = block.replace(/^```\w*\n?|```$/g, '').trim();
    return `<pre><code>${code}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings (at line start, # to ######)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Bold ** or __
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic * or _
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">$1</a>');

  // Unordered list items (- or * at line start)
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  // Ordered list
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ol> (simplified: treat as ul if already wrapped)
  // Wrap consecutive <li> in <ol> (avoid matching when already inside </ul>)
  html = html.replace(/\n(<li>.*<\/li>\n?)+/g, (match) => `<ol>${match.trim()}</ol>`);

  // Paragraphs: wrap remaining line blocks in <p>
  const lines = html.split(/\n/);
  const result: string[] = [];
  let inBlock = false;
  let block: string[] = [];

  for (const line of lines) {
    const isBlockElement = /^<(h[1-6]|ul|ol|li|pre|code)\b/.test(line) || line.startsWith('</');
    if (isBlockElement || line.trim() === '') {
      if (block.length > 0) {
        result.push('<p>' + block.join('\n') + '</p>');
        block = [];
      }
      if (line.trim() !== '') result.push(line);
      inBlock = isBlockElement;
    } else {
      block.push(line);
    }
  }
  if (block.length > 0) {
    result.push('<p>' + block.join('\n') + '</p>');
  }

  return result.join('\n').trim() || html;
}

/**
 * Return YouTube embed URL if the given URL is a YouTube watch or youtu.be link; otherwise null.
 */
export function youtubeEmbedUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  return null;
}
