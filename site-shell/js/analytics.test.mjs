/**
 * Unit tests for analytics event property builders (no browser / PostHog required).
 */
import {
  buildBaseProps,
  buildSessionEndProps,
  clarityEventNameFor,
  contentIdsForType,
  detectSiteEnv,
} from './analytics.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// --- detectSiteEnv -------------------------------------------------------
assert(detectSiteEnv('localhost') === 'local', 'localhost → local');
assert(detectSiteEnv('127.0.0.1') === 'local', '127.0.0.1 → local');
assert(detectSiteEnv('something.netlify.app') === 'sandbox', 'netlify → sandbox');
assert(detectSiteEnv('user.github.io') === 'production', 'github.io → production');

// --- contentIdsForType ---------------------------------------------------
assert(contentIdsForType('lecture', 'par9').lecture === 'par9', 'lecture id set');
assert(contentIdsForType('lecture', 'par9').dawrat === 'none', 'dawrat none on lecture');
assert(contentIdsForType('dawrat', 'exam1').dawrat === 'exam1', 'dawrat id set');
assert(contentIdsForType('note', 'par1').note === 'par1', 'note id set');

// --- buildBaseProps (home) -----------------------------------------------
const home = buildBaseProps({
  subjectName: 'قواعد بيانات ٢',
  storagePrefix: 'databases-2',
  page: '/databases-2/home',
  contentType: 'home',
  contentId: 'home',
  siteEnv: 'production',
});
assert(home.subject === 'قواعد بيانات ٢', 'home subject');
assert(home.storage_prefix === 'databases-2', 'home storage_prefix');
assert(home.page === '/databases-2/home', 'home page');
assert(home.content_type === 'home', 'home content_type');
assert(home.content_id === 'home', 'home content_id');
assert(home.lecture === 'none' && home.dawrat === 'none' && home.note === 'none', 'home ids none');
assert(home.site_env === 'production', 'home site_env');

// --- buildBaseProps (lecture) --------------------------------------------
const lec = buildBaseProps({
  subjectName: 'هندسة البرمجيات ٢',
  storagePrefix: 'software-engineering-2',
  page: '/software-engineering-2/lectures/par9',
  contentType: 'lecture',
  contentId: 'par9',
  siteEnv: 'production',
});
assert(lec.lecture === 'par9', 'lecture tag');
assert(lec.dawrat === 'none' && lec.note === 'none', 'other tags none');
assert(lec.content_type === 'lecture' && lec.content_id === 'par9', 'lecture content fields');

// --- buildSessionEndProps — all dimensions on one payload ----------------
const end = buildSessionEndProps(lec, { activeSeconds: 320, maxScrollPct: 75 });
assert(end.active_seconds === 320, 'active_seconds on session end');
assert(end.max_scroll_pct === 75, 'max_scroll_pct on session end');
assert(end.subject === 'هندسة البرمجيات ٢', 'session end keeps subject');
assert(end.content_id === 'par9', 'session end keeps content_id');
assert(end.page === '/software-engineering-2/lectures/par9', 'session end keeps page');
assert(end.content_type === 'lecture', 'session end keeps content_type');
assert(end.storage_prefix === 'software-engineering-2', 'session end keeps storage_prefix');

// Focus milestone payload shape (same base + focus_minutes)
const focus = { ...lec, focus_minutes: 5, active_seconds: 320 };
assert(focus.focus_minutes === 5 && focus.subject === lec.subject, 'focus milestone shape');

// --- Clarity event name mapping (backward compatible) --------------------
assert(
  clarityEventNameFor('scroll_milestone', { milestone_pct: 75 }) === 'scroll_75',
  'clarity scroll event',
);
assert(
  clarityEventNameFor('study_session_end', { content_type: 'lecture' }) === 'lecture_session_end',
  'clarity session end',
);
assert(
  clarityEventNameFor('focus_milestone', { content_type: 'dawrat', focus_minutes: 5 }) ===
    'dawrat_focus_5min',
  'clarity focus event',
);
assert(clarityEventNameFor('content_viewed', lec) === null, 'pageviews are tags-only on Clarity');
assert(clarityEventNameFor('hub_pageview', {}) === 'hub_pageview', 'hub pageview clarity event');

console.log('analytics.test.mjs: ok');
