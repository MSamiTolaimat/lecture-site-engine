/**
 * Study-content analytics — PostHog (queryable events) + Microsoft Clarity (heatmaps/recordings)
 *
 * Tracks per subject site (SPA):
 * - Virtual pages: /home, /lectures/{id}, /dawrat/{id}, /notes/{id}
 * - Focused minutes: visible tab + user activity (scroll/click/key), idle after 2 min
 * - Scroll milestones: 25 / 50 / 75 / 100 % of content scroll depth
 *
 * PostHog: every event carries full context as properties (HogQL-queryable).
 * Clarity: same signals as custom tags + events (session replay / filters UI).
 */

const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
const SCROLL_MILESTONES = [25, 50, 75, 100];
const DEFAULT_POSTHOG_HOST = 'https://eu.i.posthog.com';

/** @type {{ subjectName: string, storagePrefix: string } | null} */
let context = null;

/** @type {StudySession | null} */
let activeSession = null;

/** @type {boolean} */
let posthogReady = false;

/** @type {((event: string, props?: Record<string, unknown>) => void) | null} */
let captureImpl = null;

/** Inject a capture sink (tests). Pass null to restore default. */
export function __setCaptureForTests(fn) {
  captureImpl = fn;
}

export function detectSiteEnv(hostname = typeof location !== 'undefined' ? location.hostname : '') {
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'local';
  if (hostname.includes('netlify')) return 'sandbox';
  return 'production';
}

/**
 * @param {'home' | 'lecture' | 'dawrat' | 'note'} contentType
 * @param {string} contentId
 */
export function contentIdsForType(contentType, contentId) {
  return {
    lecture: contentType === 'lecture' ? contentId : 'none',
    dawrat: contentType === 'dawrat' ? contentId : 'none',
    note: contentType === 'note' ? contentId : 'none',
  };
}

/**
 * @param {{
 *   subjectName?: string,
 *   storagePrefix?: string,
 *   page: string,
 *   contentType: string,
 *   contentId: string,
 *   siteEnv?: string,
 * }} opts
 */
export function buildBaseProps(opts) {
  const contentType = opts.contentType || 'home';
  const contentId = opts.contentId || 'home';
  const ids =
    contentType === 'lecture' || contentType === 'dawrat' || contentType === 'note'
      ? contentIdsForType(contentType, contentId)
      : { lecture: 'none', dawrat: 'none', note: 'none' };
  return {
    subject: opts.subjectName || '',
    storage_prefix: opts.storagePrefix || 'study-guide',
    site_env: opts.siteEnv || detectSiteEnv(),
    page: opts.page,
    content_type: contentType,
    content_id: contentId,
    ...ids,
  };
}

/**
 * @param {ReturnType<typeof buildBaseProps>} base
 * @param {{ activeSeconds: number, maxScrollPct: number }} session
 */
export function buildSessionEndProps(base, session) {
  return {
    ...base,
    active_seconds: session.activeSeconds,
    max_scroll_pct: session.maxScrollPct,
  };
}

/**
 * Map PostHog event names → Clarity custom event names (keeps existing Clarity filters working).
 * @param {string} event
 * @param {Record<string, unknown>} props
 */
export function clarityEventNameFor(event, props = {}) {
  const type = String(props.content_type || 'content');
  if (event === 'scroll_milestone') return `scroll_${props.milestone_pct}`;
  if (event === 'study_idle') return `${type}_idle`;
  if (event === 'study_session_end') return `${type}_session_end`;
  if (event === 'focus_milestone') return `${type}_focus_${props.focus_minutes}min`;
  if (event === 'hub_pageview' || event === 'hub_subject_click') return event;
  return null;
}

function virtualPath(segment) {
  const prefix = context?.storagePrefix || 'study-guide';
  const base = `/${prefix}`;
  if (!segment || segment === 'home') return `${base}/home`;
  return `${base}/${segment.replace(/^\//, '')}`;
}

function readMeta(name) {
  if (typeof document === 'undefined') return '';
  const el = document.querySelector(`meta[name="${name}"]`);
  return (el?.getAttribute('content') || '').trim();
}

function posthogAvailable() {
  return typeof window !== 'undefined' && typeof window.posthog?.capture === 'function';
}

function clarityAvailable() {
  return typeof window !== 'undefined' && typeof window.clarity === 'function';
}

function clarityCall(...args) {
  if (!clarityAvailable()) return;
  try {
    window.clarity(...args);
  } catch {
    /* ignore */
  }
}

function claritySet(key, value) {
  if (value == null || value === '') return;
  clarityCall('set', key, String(value));
}

/** Push tags + mapped event to Clarity (best-effort; never throws). */
function mirrorToClarity(event, props = {}) {
  const tagKeys = [
    'subject',
    'content_type',
    'content_id',
    'lecture',
    'dawrat',
    'note',
    'active_seconds',
    'max_scroll_pct',
    'site_env',
    'storage_prefix',
    'subject_id',
    'year',
  ];
  for (const key of tagKeys) {
    if (props[key] != null && props[key] !== '') claritySet(key, props[key]);
  }
  if (props.page) clarityCall('set', 'page', String(props.page));

  const clarityEvent = clarityEventNameFor(event, props);
  if (clarityEvent) clarityCall('event', clarityEvent);
}

function capture(event, props = {}) {
  if (captureImpl) {
    try {
      captureImpl(event, props);
    } catch {
      /* ignore */
    }
    return;
  }
  try {
    if (posthogAvailable()) window.posthog.capture(event, props);
  } catch {
    /* ignore analytics errors */
  }
  mirrorToClarity(event, props);
}

function currentBase(page, contentType, contentId) {
  return buildBaseProps({
    subjectName: context?.subjectName || '',
    storagePrefix: context?.storagePrefix || 'study-guide',
    page,
    contentType,
    contentId,
  });
}

function loadPosthogSnippet(apiKey, apiHost) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(false);
      return;
    }
    if (window.posthog?.__loaded || window.posthog?.capture) {
      resolve(true);
      return;
    }

    /* PostHog array.js stub loader (official snippet, condensed) */
    (function (t, e) {
      if (e.__SV) return;
      window.posthog = e;
      e._i = [];
      e.init = function (i, s, a) {
        function g(u, n) {
          const o = n.split('.');
          if (o.length === 2) {
            u = u[o[0]];
            n = o[1];
          }
          u[n] = function () {
            u.push([n].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        const p = t.createElement('script');
        p.type = 'text/javascript';
        p.async = true;
        p.src = `${s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com')}/static/array.js`;
        p.onerror = () => reject(new Error('PostHog script failed to load'));
        const r = t.getElementsByTagName('script')[0];
        r.parentNode.insertBefore(p, r);
        const u = a !== undefined ? (e[a] = []) : ((a = 'posthog'), e);
        u.people = u.people || [];
        u.toString = function (t2) {
          let x = 'posthog';
          if (a !== 'posthog') x += `.${a}`;
          if (!t2) x += ' (stub)';
          return x;
        };
        u.people.toString = function () {
          return `${u.toString(1)}.people (stub)`;
        };
        const methods =
          'init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getSurveys getActiveMatchingSurveys identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id captureException set_config'.split(
            ' ',
          );
        for (let n = 0; n < methods.length; n++) g(u, methods[n]);
        e._i.push([i, s, a]);
      };
      e.__SV = 1;
    })(document, window.posthog || []);

    try {
      window.posthog.init(apiKey, {
        api_host: apiHost,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        persistence: 'localStorage+cookie',
        session_recording: { maskAllInputs: true },
        loaded: () => resolve(true),
      });
      // Fallback if loaded callback is slow / already ready
      setTimeout(() => resolve(true), 1500);
    } catch (err) {
      reject(err);
    }
  });
}

async function ensurePosthog() {
  if (posthogReady) return true;
  const key = readMeta('posthog-key');
  if (!key || key.startsWith('__POSTHOG')) return false;
  const host = readMeta('posthog-host') || DEFAULT_POSTHOG_HOST;
  try {
    await loadPosthogSnippet(key, host);
    posthogReady = true;
    return true;
  } catch {
    return false;
  }
}

function registerSuperProps() {
  if (!posthogAvailable()) return;
  try {
    window.posthog.register({
      subject: context?.subjectName || '',
      storage_prefix: context?.storagePrefix || 'study-guide',
      site_env: detectSiteEnv(),
    });
  } catch {
    /* ignore */
  }
}

class StudySession {
  /**
   * @param {'lecture' | 'dawrat' | 'note'} contentType
   * @param {string} contentId
   * @param {string} pageSegment
   */
  constructor(contentType, contentId, pageSegment) {
    this.contentType = contentType;
    this.contentId = contentId;
    this.page = virtualPath(pageSegment);
    this.activeMs = 0;
    this.lastTickAt = null;
    this.isVisible = document.visibilityState === 'visible';
    this.isIdle = false;
    this.idleTimer = null;
    /** @type {Set<number>} */
    this.milestonesHit = new Set();
    this.scrollRoot = null;

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onActivity = this.onActivity.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onPageHide = this.onPageHide.bind(this);
  }

  baseProps() {
    return currentBase(this.page, this.contentType, this.contentId);
  }

  begin() {
    const props = this.baseProps();
    capture('$pageview', props);
    capture('content_viewed', props);

    this.resumeTicking();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    document.addEventListener('click', this.onActivity, { passive: true });
    document.addEventListener('keydown', this.onActivity, { passive: true });
    document.addEventListener('touchstart', this.onActivity, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('pagehide', this.onPageHide);
    this.resetIdleTimer();
    requestAnimationFrame(() => this.checkScrollMilestones());
  }

  /** Call after lecture HTML is in #content */
  attachContentRoot() {
    this.scrollRoot = document.getElementById('content');
    requestAnimationFrame(() => this.checkScrollMilestones());
  }

  onVisibilityChange() {
    const visible = document.visibilityState === 'visible';
    if (visible && !this.isVisible) {
      this.isVisible = true;
      if (!this.isIdle) this.resumeTicking();
      this.resetIdleTimer();
    } else if (!visible && this.isVisible) {
      this.isVisible = false;
      this.pauseTicking();
      clearTimeout(this.idleTimer);
    }
  }

  onActivity() {
    if (this.isIdle) {
      this.isIdle = false;
      if (this.isVisible) this.resumeTicking();
    }
    this.resetIdleTimer();
  }

  onScroll() {
    this.onActivity();
    this.checkScrollMilestones();
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
      this.pauseTicking();
      capture('study_idle', {
        ...this.baseProps(),
        idle_after_seconds: Math.round(IDLE_TIMEOUT_MS / 1000),
      });
    }, IDLE_TIMEOUT_MS);
  }

  resumeTicking() {
    if (!this.isVisible || this.isIdle) return;
    if (this.lastTickAt == null) this.lastTickAt = Date.now();
  }

  pauseTicking() {
    if (this.lastTickAt == null) return;
    this.activeMs += Date.now() - this.lastTickAt;
    this.lastTickAt = null;
  }

  getActiveSeconds() {
    let total = this.activeMs;
    if (this.lastTickAt != null && this.isVisible && !this.isIdle) {
      total += Date.now() - this.lastTickAt;
    }
    return Math.max(0, Math.round(total / 1000));
  }

  checkScrollMilestones() {
    const depth = this.readScrollDepth();
    if (depth <= 0) return;

    for (const milestone of SCROLL_MILESTONES) {
      if (depth < milestone || this.milestonesHit.has(milestone)) continue;
      this.milestonesHit.add(milestone);
      capture('scroll_milestone', {
        ...this.baseProps(),
        milestone_pct: milestone,
      });
    }
  }

  readScrollDepth() {
    const doc = document.documentElement;
    const scrollHeight = Math.max(
      doc.scrollHeight,
      document.body?.scrollHeight || 0,
      this.scrollRoot?.scrollHeight || 0,
    );
    const viewport = window.innerHeight || doc.clientHeight;
    const maxScroll = scrollHeight - viewport;
    if (maxScroll <= 0) return 100;
    const y = window.scrollY || doc.scrollTop || 0;
    return Math.min(100, Math.round((y / maxScroll) * 100));
  }

  onPageHide() {
    this.end();
  }

  end() {
    this.pauseTicking();
    clearTimeout(this.idleTimer);

    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    document.removeEventListener('click', this.onActivity);
    document.removeEventListener('keydown', this.onActivity);
    document.removeEventListener('touchstart', this.onActivity);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pagehide', this.onPageHide);

    const seconds = this.getActiveSeconds();
    const maxScroll = this.milestonesHit.size
      ? Math.max(...this.milestonesHit)
      : 0;

    const endProps = buildSessionEndProps(this.baseProps(), {
      activeSeconds: seconds,
      maxScrollPct: maxScroll,
    });
    capture('study_session_end', endProps);

    for (const minutes of [1, 5, 15]) {
      if (seconds >= minutes * 60) {
        capture('focus_milestone', {
          ...this.baseProps(),
          focus_minutes: minutes,
          active_seconds: seconds,
        });
      }
    }
  }
}

function endActiveSession() {
  if (!activeSession) return;
  activeSession.end();
  activeSession = null;
}

/**
 * @param {{ subjectName?: string, storagePrefix?: string }} options
 */
export function initAnalytics(options = {}) {
  context = {
    subjectName: options.subjectName || '',
    storagePrefix: options.storagePrefix || 'study-guide',
  };
  window.addEventListener('pagehide', endActiveSession);

  ensurePosthog().then((ok) => {
    if (ok) registerSuperProps();
  });
}

export function trackHomeView() {
  endActiveSession();
  const page = virtualPath('home');
  const props = currentBase(page, 'home', 'home');
  capture('$pageview', props);
  capture('content_viewed', props);
}

/**
 * @param {{ lec: { id: string } }} item
 */
export function trackLectureView(item) {
  if (!item?.lec?.id) return;
  endActiveSession();
  activeSession = new StudySession('lecture', item.lec.id, `lectures/${item.lec.id}`);
  activeSession.begin();
}

/** @param {{ exam: { id: string } }} item */
export function trackDawratView(item) {
  if (!item?.exam?.id) return;
  endActiveSession();
  activeSession = new StudySession('dawrat', item.exam.id, `dawrat/${item.exam.id}`);
  activeSession.begin();
}

/** @param {{ lec: { id: string } }} item */
export function trackNoteView(item) {
  if (!item?.lec?.id) return;
  endActiveSession();
  activeSession = new StudySession('note', item.lec.id, `notes/${item.lec.id}`);
  activeSession.begin();
}

export function trackLectureContentReady() {
  activeSession?.attachContentRoot();
}

export function updateAnalyticsContext(patch) {
  context = { ...(context || { subjectName: '', storagePrefix: 'study-guide' }), ...patch };
  registerSuperProps();
}
