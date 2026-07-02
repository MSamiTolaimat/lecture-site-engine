/**
 * Minimal diagram YAML parser for ```diagram fences.
 * Returns structured data or throws — caller falls back to raw code block.
 */
export function parseDiagramYaml(text) {
  const result = { type: 'flowchart', title: '', direction: 'TD', nodes: [], edges: [] };

  /** @type {'nodes'|'edges'|null} */
  let section = null;
  /** @type {Record<string, unknown>|null} */
  let current = null;

  for (const raw of String(text).split('\n')) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const top = trimmed.match(/^([a-zA-Z][\w-]*):\s*(.*)$/);
    if (top && !raw.startsWith(' ') && !raw.startsWith('\t')) {
      const [, key, val] = top;
      if (key === 'nodes' || key === 'edges') {
        section = key;
        current = null;
        continue;
      }
      if (key === 'type') result.type = val;
      else if (key === 'title') result.title = val.replace(/^["']|["']$/g, '');
      else if (key === 'direction') result.direction = val;
      section = null;
      current = null;
      continue;
    }

    const item = trimmed.match(/^-\s+(.+)$/);
    if (item && section) {
      current = parseInlineKv(item[1]);
      if (section === 'nodes') result.nodes.push(normalizeNode(current));
      else result.edges.push(normalizeEdge(current));
      continue;
    }

    const kv = trimmed.match(/^([\w-]+):\s*(.+)$/);
    if (kv && current) {
      current[kv[1]] = parseVal(kv[2]);
      if (section === 'nodes') {
        const idx = result.nodes.length - 1;
        if (idx >= 0) result.nodes[idx] = normalizeNode(current);
      } else if (section === 'edges') {
        const idx = result.edges.length - 1;
        if (idx >= 0) result.edges[idx] = normalizeEdge(current);
      }
    }
  }

  return result;
}

function parseVal(raw) {
  const v = raw.trim();
  if (/^-?\d+$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseInlineKv(text) {
  const obj = {};
  for (const part of String(text).split(/,\s*(?=[\w-]+:)/)) {
    const kv = part.trim().match(/^([\w-]+):\s*(.*)$/);
    if (kv) obj[kv[1]] = parseVal(kv[2]);
  }
  return obj;
}

function normalizeNode(obj) {
  return {
    id: String(obj.id || ''),
    label: String(obj.label || obj.id || ''),
    kind: String(obj.kind || 'task'),
    level: Number(obj.level ?? 0),
  };
}

function normalizeEdge(obj) {
  return {
    from: String(obj.from || ''),
    to: String(obj.to || ''),
    label: obj.label ? String(obj.label) : undefined,
    flow: obj.flow || 'forward',
  };
}
