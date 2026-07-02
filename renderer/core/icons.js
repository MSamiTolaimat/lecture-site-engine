export function ms(icon, filled = false, cls = '') {
  const fill = filled ? ' style="font-variation-settings:\'FILL\' 1"' : '';
  return `<span class="material-symbols-outlined ${cls}"${fill}>${icon}</span>`;
}

export const PART_MAT_ICONS = {
  detail: 'menu_book',
  summary: 'summarize',
  mcq: 'quiz',
  debug: 'bug_report',
  theory: 'edit_note',
  cheat: 'key',
  exercise: 'terminal',
  trace: 'track_changes',
  design: 'architecture',
  qa: 'style',
  reference: 'integration_instructions',
};
