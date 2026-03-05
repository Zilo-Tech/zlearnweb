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

  const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let html = escapeHtml(normalized);

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

  // Images ![alt](url) - before links so link regex doesn't consume
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const safeUrl = String(url).trim().replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeAlt = String(alt).trim().replace(/"/g, '&quot;');
    return `<img src="${safeUrl}" alt="${safeAlt}" class="max-w-full h-auto rounded shadow-sm my-2" loading="lazy" />`;
  });

  // Links [text](url) - escape URL for safe href (quotes, etc.)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    const safeUrl = String(url).trim().replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline hover:underline cursor-pointer">${text}</a>`;
  });

  // Horizontal rules --- or ___ (before list so -* don't become list)
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr class="border-gray-200 my-4" />');

  // Blockquotes (> at line start; after escapeHtml '>' is '&gt;')
  html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote class="border-l-4 border-primary-200 pl-4 my-2 text-gray-600">$1</blockquote>');

  // Unordered list items (- or * at line start)
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  // Ordered list
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ol> (simplified: treat as ul if already wrapped)
  // Wrap consecutive <li> in <ol> (avoid matching when already inside </ul>)
  html = html.replace(/\n(<li>.*<\/li>\n?)+/g, (match) => `<ol>${match.trim()}</ol>`);

  // Markdown tables: | col1 | col2 | ... then |---| then body rows
  const tableLine = /^\|(.+)\|$/;
  const tableLines: string[] = [];
  const tableBlock: string[] = [];
  const flushTable = () => {
    if (tableBlock.length < 2) return;
    const headerCells = tableBlock[0].split('|').map((c) => c.trim()).filter(Boolean);
    const isSep = tableBlock[1].replace(/\s/g, '').replace(/-/g, '').replace(/\|/g, '') === '';
    const bodyStart = isSep ? 2 : 1;
    let out = '<table class="min-w-full border border-gray-200 text-sm"><thead><tr>';
    headerCells.forEach((c) => { out += `<th class="border border-gray-200 px-3 py-2 text-left font-medium">${c}</th>`; });
    out += '</tr></thead><tbody>';
    for (let i = bodyStart; i < tableBlock.length; i++) {
      const cells = tableBlock[i].split('|').map((c) => c.trim()).filter(Boolean);
      out += '<tr>';
      cells.forEach((c) => { out += `<td class="border border-gray-200 px-3 py-2">${c}</td>`; });
      out += '</tr>';
    }
    out += '</tbody></table>';
    tableLines.push('<div class="overflow-x-auto my-4 rounded-lg border border-gray-200">' + out + '</div>');
  };
  const lineArr = html.split('\n');
  for (let i = 0; i < lineArr.length; i++) {
    const line = lineArr[i];
    if (tableLine.test(line)) {
      tableBlock.push(line);
      continue;
    }
    if (tableBlock.length > 0) {
      flushTable();
      tableBlock.length = 0;
    }
    tableLines.push(line);
  }
  if (tableBlock.length > 0) flushTable();
  html = tableLines.join('\n');

  // Paragraphs: wrap remaining line blocks in <p>
  const lines = html.split(/\n/);
  const result: string[] = [];
  let inBlock = false;
  let block: string[] = [];

  for (const line of lines) {
    const isBlockElement = /^<(h[1-6]|ul|ol|li|pre|code|table|thead|tbody|tr|th|td|blockquote|hr|div)\b/.test(line) || line.startsWith('</');
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

  // Already an embed URL
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtu.be/embed/')) {
    return trimmed;
  }
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
