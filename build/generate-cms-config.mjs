#!/usr/bin/env node
/**
 * Generate admin/config.yml for Decap CMS from subjects/ tree.
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listAllSubjectDirs } from './lib/scaffold-subject.mjs';
import { ENGINE_ROOT } from './lib/subject-paths.mjs';

const REPO = process.env.GITHUB_REPOSITORY || 'Shahd-Abbara/lecture-site-engine';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const SITE_URL = (process.env.SITE_URL || 'https://shahd-abbara.github.io/lecture-site-engine').toLowerCase();
const OAUTH_BASE = process.env.DECAP_OAUTH_BASE_URL || '';
const LOCAL_BACKEND = process.env.LOCAL_BACKEND === 'true';

function q(s) {
  return JSON.stringify(String(s));
}

/** @param {string} subjectRel */
function collectionId(subjectRel) {
  return subjectRel.replace(/\//g, '_').replace(/-/g, '_');
}

/** @param {string} subjectRel */
async function subjectLabel(subjectRel) {
  const manifestPath = path.join(ENGINE_ROOT, 'subjects', subjectRel, 'lectures/manifest.json');
  if (existsSync(manifestPath)) {
    try {
      const m = JSON.parse(await readFile(manifestPath, 'utf8'));
      const ar = m.settings?.subjectName;
      const en = m.settings?.subjectNameEn;
      if (ar && en) return `${ar} (${en})`;
      if (ar) return ar;
      if (m.title) return m.title;
    } catch { /* ignore */ }
  }
  return subjectRel;
}

/** @returns {Promise<string>} */
async function themeOptionsYaml(indent) {
  const pad = ' '.repeat(indent);
  const themesPath = path.join(ENGINE_ROOT, 'themes/themes.json');
  if (!existsSync(themesPath)) return `${pad}- { label: "amber-default", value: "amber-default" }`;
  const data = JSON.parse(await readFile(themesPath, 'utf8'));
  return (data.themes || [])
    .map(t => `${pad}- { label: ${q(`${t.name_ar} — ${t.name_en}`)}, value: ${q(t.id)} }`)
    .join('\n');
}

/** @param {string} subjectRel @param {string} label */
function lectureCollectionYaml(subjectRel, label) {
  const id = collectionId(subjectRel);
  return `  - name: ${q(`lectures_${id}`)}
    label: ${q(`${label} — محاضرات`)}
    label_singular: ${q('محاضرة')}
    folder: ${q(`subjects/${subjectRel}/lectures`)}
    create: true
    extension: md
    format: frontmatter
    slug: "{{slug}}"
    identifier_field: slug
    summary: "{{slug}}"
    fields:
      - label: ${q('اسم الملف')}
        name: slug
        widget: string
        meta: true
        hint: ${q('مثال: par1 أو par1-sec2')}
        pattern: ['^par\\\\d+(-sec\\\\d+)?$', ${q('استخدم parN أو parN-secN')}]
      - label: ${q('محتوى المحاضرة')}
        name: body
        widget: markdown
        hint: ${q('اتبع SCHEMA.md')}`;
}

/** @param {string} subjectRel @param {string} label @param {string} themeOpts */
function settingsCollectionYaml(subjectRel, label, themeOpts) {
  const id = collectionId(subjectRel);
  return `  - name: ${q(`settings_${id}`)}
    label: ${q(`${label} — إعدادات`)}
    files:
      - label: Manifest
        name: manifest
        file: ${q(`subjects/${subjectRel}/lectures/manifest.json`)}
        fields:
          - label: ${q('الإعدادات')}
            name: settings
            widget: object
            fields:
              - { label: ${q('اسم المادة (عربي)')}, name: subjectName, widget: string }
              - { label: ${q('اسم المادة (إنجليزي)')}, name: subjectNameEn, widget: string }
              - { label: ${q('السنة الدراسية')}, name: year, widget: string, default: "2025-2026" }
              - { label: ${q('السنة (رقم)')}, name: academicYear, widget: number, value_type: int, min: 1, max: 5 }
              - label: ${q('الثيم')}
                name: theme
                widget: select
                default: amber-default
                options:
${themeOpts}
              - { label: ${q('القسم')}, name: department, widget: string }
          - { label: ${q('عنوان الموقع')}, name: title, widget: string }
          - { label: ${q('العنوان الفرعي')}, name: subtitle, widget: string }
          - label: ${q('أيقونات المحاضرات')}
            name: lectureIcons
            widget: list
            field: { label: emoji, name: emoji, widget: string }
          - label: ${q('أيقونات Material')}
            name: lectureMatIcons
            widget: list
            field: { label: icon, name: icon, widget: string }`;
}

async function main() {
  const themeOpts = await themeOptionsYaml(18);
  const subjects = (await listAllSubjectDirs()).filter(s =>
    existsSync(path.join(ENGINE_ROOT, 'subjects', s, 'lectures')),
  );

  const collectionBlocks = [];
  for (const subjectRel of subjects) {
    const label = await subjectLabel(subjectRel);
    collectionBlocks.push(lectureCollectionYaml(subjectRel, label));
    collectionBlocks.push(settingsCollectionYaml(subjectRel, label, themeOpts));
  }

  const oauthLines = OAUTH_BASE
    ? `  base_url: ${q(OAUTH_BASE)}\n  auth_endpoint: auth\n`
    : '';

  const localBackendLine = LOCAL_BACKEND ? 'local_backend: true\n\n' : '';

  const yaml = `# Auto-generated — node build/generate-cms-config.mjs
backend:
  name: github
  repo: ${q(REPO)}
  branch: ${q(BRANCH)}
${oauthLines}${oauthLines ? '' : '# Production: set DECAP_OAUTH_BASE_URL secret for GitHub login (see admin/README.md)\n'}
${localBackendLine}site_url: ${q(SITE_URL)}
display_url: ${q(SITE_URL)}

media_folder: subjects/media/uploads
public_folder: /subjects/media/uploads

publish_mode: simple

collections:
${collectionBlocks.join('\n')}
`;

  const outPath = process.env.CMS_CONFIG_OUT
    ? path.resolve(ENGINE_ROOT, process.env.CMS_CONFIG_OUT)
    : path.join(ENGINE_ROOT, 'admin', 'config.yml');

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, yaml);
  console.log(`✓ ${path.relative(ENGINE_ROOT, outPath)} (${subjects.length} subject(s))`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
