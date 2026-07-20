import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENGINE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** @param {string} filePath */
export function parseSubjectFromPath(filePath) {
  const norm = filePath.replace(/\\/g, '/');
  const m = norm.match(/subjects\/(year-[1-5])\/([^/]+)\//);
  if (m) return `${m[1]}/${m[2]}`;
  const m2 = norm.match(/^(year-[1-5])\/([^/]+)\//);
  if (m2) return `${m2[1]}/${m2[2]}`;
  return null;
}

/** @param {string[]} files */
export function subjectsFromChangedFiles(files) {
  const set = new Set();
  for (const f of files) {
    const s = parseSubjectFromPath(f);
    if (s && s !== 'year-1/_template' && !s.endsWith('/_template')) {
      const parts = s.split('/');
      if (parts[1] !== '_template') set.add(s);
    }
  }
  return [...set].sort();
}

/**
 * @param {string} subjectRel e.g. year-3/kotlin
 */
export function subjectDir(subjectRel) {
  return path.join(ENGINE_ROOT, 'subjects', subjectRel);
}

export function distDir(subjectRel) {
  return path.join(ENGINE_ROOT, process.env.OUTPUT_DIR || 'dist', subjectRel);
}

export function subjectHasLectures(subjectRel) {
  const lectures = path.join(subjectDir(subjectRel), 'lectures');
  if (!existsSync(lectures)) return false;
  return true;
}

/** Recursively list lecture Markdown paths relative to lectures/. */
export async function listLectureMarkdownFiles(lecturesDir, prefix = '') {
  if (!existsSync(lecturesDir)) return [];
  const entries = await readdir(lecturesDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...await listLectureMarkdownFiles(path.join(lecturesDir, entry.name), rel));
    } else if (/^par.+\.md$/i.test(entry.name)) {
      files.push(rel);
    }
  }
  return files.sort();
}

/** True when subject has lectures/par*.md ready to build or validate. */
export async function subjectHasBuildableLectures(subjectRel) {
  const lecturesDir = path.join(subjectDir(subjectRel), 'lectures');
  return (await listLectureMarkdownFiles(lecturesDir)).length > 0;
}

/**
 * True when cached dist output does not exactly represent the subject's
 * current lecture sources. This is deliberately independent of git change
 * detection: a stale/partial restored cache must repair itself even when the
 * subject was not touched in the current push.
 */
export async function subjectNeedsLectureBuild(subjectRel) {
  const sourceLecturesDir = path.join(subjectDir(subjectRel), 'lectures');
  const builtLecturesDir = path.join(distDir(subjectRel), 'lectures');
  const builtManifestPath = path.join(builtLecturesDir, 'manifest.json');

  if (!existsSync(builtManifestPath)) return true;

  let manifest;
  try {
    manifest = JSON.parse(await readFile(builtManifestPath, 'utf8'));
  } catch {
    return true;
  }

  const sourceFiles = await listLectureMarkdownFiles(sourceLecturesDir);
  const builtSources = (manifest.files || [])
    .map(file => {
      const entry = typeof file === 'string' ? { path: file } : file;
      return String(entry.source || entry.path || '').replace(/\.json$/i, '.md');
    })
    .filter(Boolean)
    .sort();

  if (sourceFiles.length !== builtSources.length) return true;
  if (sourceFiles.some((name, i) => name !== builtSources[i])) return true;

  // A manifest entry without its parsed JSON is also an incomplete cache.
  return (manifest.files || []).some(file => {
    const entry = typeof file === 'string' ? { path: file } : file;
    const jsonPath = String(entry.path || '').replace(/\.md$/i, '.json');
    return !jsonPath || !existsSync(path.join(builtLecturesDir, jsonPath));
  });
}

/** Dist missing parsed review JSON while source has review.md in manifest. */
export async function subjectNeedsReviewBuild(subjectRel) {
  const reviewsDir = path.join(subjectDir(subjectRel), 'reviews');
  const manifestPath = path.join(reviewsDir, 'manifest.json');
  if (!existsSync(manifestPath)) return false;

  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    return false;
  }

  const distReviews = path.join(distDir(subjectRel), 'reviews');
  for (const file of manifest.files || []) {
    const rel = typeof file === 'string' ? file : file.path;
    if (!rel || !/\.md$/i.test(rel)) continue;
    if (!existsSync(path.join(reviewsDir, rel))) continue;
    const jsonName = rel.replace(/\.md$/i, '.json');
    if (!existsSync(path.join(distReviews, jsonName))) return true;
  }
  return false;
}

/** All subjects under year-1..year-5 that have lectures/ and at least one par*.md */
export async function listAllSubjectsWithLectures() {
  /** @type {string[]} */
  const found = [];
  for (let y = 1; y <= 5; y++) {
    const yearDir = path.join(ENGINE_ROOT, 'subjects', `year-${y}`);
    if (!existsSync(yearDir)) continue;
    const entries = await readdir(yearDir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory() || ent.name === '_template' || ent.name.startsWith('.')) continue;
      const rel = `year-${y}/${ent.name}`;
      if (await subjectHasBuildableLectures(rel)) found.push(rel);
    }
  }
  return found.sort();
}

export { ENGINE_ROOT };
