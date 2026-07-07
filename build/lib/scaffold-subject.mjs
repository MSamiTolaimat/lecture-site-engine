import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ENGINE_ROOT, subjectDir } from './subject-paths.mjs';

const TEMPLATE_DIR = path.join(ENGINE_ROOT, 'subjects/_template');
const CURRENT_ACADEMIC_YEAR = '2025-2026';
const DEFAULT_ICONS = ['📌', '📖', '💻', '🎯', '📝'];
const DEFAULT_MAT_ICONS = ['school', 'menu_book', 'code', 'quiz', 'description'];

/** @param {string} text @param {string} section @param {string} key */
function briefField(text, section, key) {
  const sec = text.match(new RegExp(`^${section}:\\s*\\n((?:  .+\\n)*)`, 'm'));
  if (!sec) return null;
  const m = sec[1].match(
    new RegExp(`^  ${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n#]+))`, 'm'),
  );
  const val = (m?.[1] ?? m?.[2] ?? m?.[3])?.trim();
  return val || null;
}

/** @param {string} text */
export function parseSubjectBrief(text) {
  if (!text) return {};
  const domain = text.match(/^domain:\s*["']?([^"'\n#]+)["']?/m);
  return {
    id: briefField(text, 'subject', 'id'),
    name_ar: briefField(text, 'subject', 'name_ar'),
    name_en: briefField(text, 'subject', 'name_en'),
    tagline: briefField(text, 'subject', 'tagline'),
    section_label: briefField(text, 'subject', 'section_label'),
    unit_label: briefField(text, 'lecture', 'unit_label'),
    split_regex: briefField(text, 'lecture', 'split_regex'),
    domain: domain?.[1]?.trim() || null,
  };
}

/** @param {string} subjectRel */
export function academicYearFromPath(subjectRel) {
  const m = subjectRel.match(/^year-(\d)\//);
  return m ? Number(m[1]) : 1;
}

/** @param {string} id @param {string|null} domain */
export function inferTheme(id, domain) {
  const s = `${id} ${domain || ''}`;
  if (/kotlin|android/i.test(s)) return 'kotlin-pink-blue';
  if (/software|sw-eng/i.test(s)) return 'software-purple';
  if (/programming.lang|prog.lang/i.test(s)) return 'programming-blue-lavender';
  if (/parallel|kinetic|os|operating/i.test(s)) return 'parallel-teal';
  if (/gis|data.ops|data-operations/i.test(s)) return 'gis-earth';
  return 'amber-default';
}

/** @param {string} filename */
export function parseParFilename(filename) {
  const m = filename.match(/^par(\d+)(?:-sec(\d+))?\.md$/i);
  if (!m) return null;
  return { num: Number(m[1]), sec: m[2] ? Number(m[2]) : null };
}

/** @param {number} n */
export function toArabicDigits(n) {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

/** @param {number} num @param {number|null} sec */
export function defaultSectionBadge(num, sec) {
  if (sec) return `المحاضرة ${toArabicDigits(num)} — جزء ${toArabicDigits(sec)}`;
  return `المحاضرة ${toArabicDigits(num)}`;
  return null;    
}

/**
 * @param {object} manifest
 * @param {string[]} mdFiles sorted par*.md names
 */
export function syncManifestFiles(manifest, mdFiles) {
  const icons = manifest.lectureIcons?.length ? manifest.lectureIcons : DEFAULT_ICONS;
  const matIcons = manifest.lectureMatIcons?.length ? manifest.lectureMatIcons : DEFAULT_MAT_ICONS;
  const files = [...(manifest.files || [])];
  const byPath = new Map(files.map(f => [String(f.path).replace(/\.json$/i, '.md'), f]));

  for (let i = 0; i < mdFiles.length; i++) {
    const name = mdFiles[i];
    if (byPath.has(name)) {
      const entry = byPath.get(name);
  
      if (!entry.badge) {
          const parsed = parseParFilename(name);
          entry.badge = defaultSectionBadge(parsed.num, parsed.sec);
      }
  
      continue;
  }
    const parsed = parseParFilename(name);
    if (!parsed) continue;
    const entry = {
      path: name,
      num: parsed.num,
      icon: icons[i % icons.length],
      matIcon: matIcons[i % matIcons.length],
    };
    const badge = defaultSectionBadge(parsed.num, parsed.sec);
    if (badge) entry.badge = badge;
    files.push(entry);
    byPath.set(name, entry);
  }

  files.sort((a, b) => {
    const pa = parseParFilename(String(a.path).replace(/\.json$/i, '.md'));
    const pb = parseParFilename(String(b.path).replace(/\.json$/i, '.md'));
    if (!pa || !pb) return String(a.path).localeCompare(String(b.path));
    if (pa.num !== pb.num) return pa.num - pb.num;
    return (pa.sec || 0) - (pb.sec || 0);
  });

  manifest.files = files;
  return manifest;
}

/** @param {ReturnType<typeof parseSubjectBrief>} brief @param {string} subjectRel @param {string} folderName */
function buildManifest(brief, subjectRel, folderName) {
  const academicYear = academicYearFromPath(subjectRel);
  const id = brief.id || folderName;
  const nameAr = brief.name_ar || folderName;
  const nameEn = brief.name_en || folderName;
  const tagline = brief.tagline || 'دليل دراسي تفاعلي';
  return {
    settings: {
      subjectName: nameAr,
      subjectNameEn: nameEn,
      year: CURRENT_ACADEMIC_YEAR,
      academicYear,
      theme: inferTheme(id, brief.domain),
      department: brief.section_label || 'القسم',
    },
    title: `${nameAr} — ${nameEn}`,
    subtitle: tagline,
    files: [],
    lectureIcons: DEFAULT_ICONS,
    lectureMatIcons: DEFAULT_MAT_ICONS,
  };
}

/** @param {ReturnType<typeof parseSubjectBrief>} brief @param {string} subjectId */
function buildGuideConfig(brief, subjectId) {
  const unit = brief.unit_label || 'المحاضرة';
  const heading = brief.split_regex || `^# ${unit} `;
  const title = brief.name_ar || subjectId;
  const escapedHeading = heading.replace(/\\/g, '\\\\');

  return `/**
 * Auto-scaffolded from subject-brief.yaml — edit as needed.
 */
export const GUIDE_CONFIG = {
  storagePrefix: '${subjectId.replace(/'/g, "\\'")}',
  defaultTitle: '${title.replace(/'/g, "\\'")}',
  homeHeaderBrand: 'موقع تفاعلي - المكتب الأكاديمي',
  defaultSubtitle: '${(brief.tagline || 'دليل دراسي تفاعلي').replace(/'/g, "\\'")}',

  showRoadmapCard: false,

  lectureSplit: /(?=${escapedHeading})/m,
  lectureHeading: /${escapedHeading}/,

  sectionRefPattern: /(?:par\\d+(?:-sec\\d+)?\\.md\\s*)?§(\\d+(?:\\.\\d+)*)/g,

  partTypes: [
    { match: /MCQ|اختيار من متعدد/i, type: 'mcq', icon: '🎯' },
    { match: /بطاقات سؤال|Q&A Cards/i, type: 'qa', icon: '🃏' },
    { match: /تصحيح/i, type: 'debug', icon: '🐛' },
    { match: /تتبع/i, type: 'trace', icon: '🔍' },
    { match: /تصميم|صمّم/i, type: 'design', icon: '📐' },
    { match: /نظرية/i, type: 'theory', icon: '📝' },
    { match: /Cheat Sheet|المراجعة السريعة/i, type: 'cheat', icon: '🔑' },
    { match: /Checklist|قائمة فحص|قائمة المراجعة/i, type: 'summary', icon: '✅' },
    { match: /الكود النهائي|مرجع شامل/i, type: 'reference', icon: '📎' },
    { match: /ملخص/i, type: 'summary', icon: '📋' },
    { match: /تمارين|تمرين/i, type: 'exercise', icon: '💻' },
    { match: /شرح|مقدمة|خريطة التكامل/i, type: 'detail', icon: '📖' },
  ],

  callouts: [
    { re: /^مهم للامتحان/, cls: 'callout-exam', label: 'مهم للامتحان ⚠️' },
    { re: /^⚠️ ملاحظة هامة/, cls: 'callout-important', label: '⚠️ ملاحظة هامة' },
    { re: /^نقطة مهمة/, cls: 'callout-important', label: 'نقطة مهمة ⚠️' },
    { re: /^ملاحظة:/, cls: 'callout-note', label: 'ملاحظة' },
    { re: /^الدرس المستفاد:/, cls: 'callout-lesson', label: 'الدرس المستفاد' },
  ],

  arabicKey: { أ: 'a', ا: 'a', ب: 'b', ج: 'c', د: 'd', a: 'a', b: 'b', c: 'c', d: 'd' },
};
`;
}

async function readBrief(subjectDir) {
  const briefPath = path.join(subjectDir, 'subject-brief.yaml');
  if (!existsSync(briefPath)) return {};
  return parseSubjectBrief(await readFile(briefPath, 'utf8'));
}

/**
 * Ensure lectures/, manifest.json, guide-config.js exist for one subject.
 * @param {string} subjectRel e.g. year-4/os-2-theory
 * @returns {Promise<string[]>} created/updated file paths (relative to subject dir)
 */
export async function ensureSubjectScaffold(subjectRel) {
  const dir = subjectDir(subjectRel);
  if (!existsSync(dir)) return [];

  const folderName = subjectRel.split('/')[1];
  const brief = await readBrief(dir);
  const actions = [];

  const lecturesDir = path.join(dir, 'lectures');
  if (!existsSync(lecturesDir)) {
    await mkdir(lecturesDir, { recursive: true });
    actions.push('lectures/');
  }

  const manifestPath = path.join(lecturesDir, 'manifest.json');
  let manifest;
  let manifestCreated = false;
  if (!existsSync(manifestPath)) {
    manifest = buildManifest(brief, subjectRel, folderName);
    manifestCreated = true;
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    actions.push('lectures/manifest.json');
  } else {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    // Refresh settings from brief when manifest still has folder-name placeholders
    const folderName = subjectRel.split('/')[1];
    if (brief.name_ar && manifest.settings?.subjectName === folderName) {
      const refreshed = buildManifest(brief, subjectRel, folderName);
      manifest.settings = refreshed.settings;
      manifest.title = refreshed.title;
      manifest.subtitle = refreshed.subtitle;
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      actions.push('lectures/manifest.json (updated settings)');
    }
  }

  let mdFiles = [];
  if (existsSync(lecturesDir)) {
    mdFiles = (await readdir(lecturesDir)).filter(f => /^par.+\.md$/i.test(f)).sort();
  }

  const beforeFiles = JSON.stringify(manifest.files || []);
  syncManifestFiles(manifest, mdFiles);
  if (!manifestCreated && JSON.stringify(manifest.files) !== beforeFiles) {
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    actions.push('lectures/manifest.json (synced files)');
  }

  const guidePath = path.join(dir, 'guide-config.js');
  if (!existsSync(guidePath)) {
    const subjectId = brief.id || folderName;
    await writeFile(guidePath, buildGuideConfig(brief, subjectId));
    actions.push('guide-config.js');
  }

  return actions;
}

/** @returns {Promise<string[]>} all subject paths year-N/id */
export async function listAllSubjectDirs() {
  /** @type {string[]} */
  const found = [];
  for (let y = 1; y <= 5; y++) {
    const yearDir = path.join(ENGINE_ROOT, 'subjects', `year-${y}`);
    if (!existsSync(yearDir)) continue;
    const entries = await readdir(yearDir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory() || ent.name === '_template' || ent.name.startsWith('.')) continue;
      found.push(`year-${y}/${ent.name}`);
    }
  }
  return found.sort();
}

/** @param {string[]} [subjectRels] */
export async function scaffoldSubjects(subjectRels) {
  const targets = subjectRels?.length ? subjectRels : await listAllSubjectDirs();
  /** @type {{ subject: string, actions: string[] }[]} */
  const results = [];
  for (const subject of targets) {
    const actions = await ensureSubjectScaffold(subject);
    if (actions.length) results.push({ subject, actions });
  }
  return results;
}
