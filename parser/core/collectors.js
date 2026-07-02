export function isStructural(line) {
  const t = String(line).trim();
  return /^#{1,6} /.test(t) || /^---+$/.test(t) || /^```/.test(t) || /^\|.+\|$/.test(t) || /^> /.test(t);
}

export function isTableStart(lines, i) {
  return (
    i + 1 < lines.length
    && /^\|.+\|$/.test(lines[i].trim())
    && /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())
  );
}

export function collectBlockquote(lines, start) {
  const parts = [];
  let i = start;
  while (i < lines.length && /^> ?/.test(lines[i])) {
    parts.push(lines[i].replace(/^> ?/, ''));
    i++;
  }
  return { text: parts.join('\n'), nextIndex: i };
}

export function collectUntilHeading(lines, start) {
  let text = '';
  let i = start;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (/^#{3,4} /.test(t) || /^---+$/.test(t)) break;
    if (/^> /.test(lines[i])) {
      text += (text ? '\n' : '') + lines[i].replace(/^> ?/, '');
    } else if (t) {
      text += (text ? '\n' : '') + t;
    }
    i++;
  }
  return { text: text.trim(), nextIndex: i };
}

export function collectList(lines, start) {
  const items = [];
  let i = start;
  while (i < lines.length) {
    const t = lines[i].trim();
    const ol = t.match(/^(\d+)\.\s+(.+)/);
    const ul = t.match(/^[-*]\s+(.+)/);
    if (ol) { items.push(ol[2]); i++; continue; }
    if (ul) { items.push(ul[1]); i++; continue; }
    if (!t) { i++; break; }
    if (isStructural(lines[i])) break;
    break;
  }
  return { items, nextIndex: i };
}

export function collectParagraph(lines, start) {
  const parts = [];
  let i = start;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) break;
    if (isStructural(lines[i])) break;
    parts.push(t);
    i++;
  }
  return { text: parts.join(' '), nextIndex: i || start + 1 };
}

export function parseTable(lines, start) {
  const header = lines[start].split('|').slice(1, -1).map(c => c.trim());
  let i = start + 2;
  const rows = [];
  while (i < lines.length && /^\|.+\|$/.test(lines[i].trim())) {
    rows.push(lines[i].split('|').slice(1, -1).map(c => c.trim()));
    i++;
  }
  return { header, rows, nextIndex: i };
}

export function collectFence(lines, start) {
  const lang = lines[start].trim().slice(3).trim() || 'text';
  let i = start + 1;
  const codeLines = [];
  while (i < lines.length && !/^```/.test(lines[i].trim())) {
    codeLines.push(lines[i]);
    i++;
  }
  if (i < lines.length) i++;
  return { lang, code: codeLines.join('\n'), nextIndex: i };
}
