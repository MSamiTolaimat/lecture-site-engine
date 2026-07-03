#!/usr/bin/env node
/**
 * Copy admin/ (Decap CMS) into dist/admin/ for GitHub Pages.
 */
import { existsSync } from 'node:fs';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENGINE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ADMIN_SRC = path.join(ENGINE_ROOT, 'admin');
const ADMIN_DEST = path.join(ENGINE_ROOT, 'dist', 'admin');

async function main() {
  if (!existsSync(path.join(ADMIN_SRC, 'index.html'))) {
    console.log('Skipping admin copy — admin/index.html not found');
    return;
  }
  await mkdir(ADMIN_DEST, { recursive: true });
  await cp(path.join(ADMIN_SRC, 'index.html'), path.join(ADMIN_DEST, 'index.html'));
  console.log('✓ dist/admin/index.html (Decap CMS — config.yml generated separately)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
