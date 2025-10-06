#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const exts = new Set(['.js', '.json', '.css', '.html', '.md', '.yml', '.yaml', '.svg', '.txt']);
const ignoreDirs = new Set(['.git', 'node_modules']);

const root = process.cwd();
const bad = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const name of list) {
    if (ignoreDirs.has(name)) continue;
    const full = path.join(dir, name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch (e) {
      continue;
    }
    if (stat.isDirectory()) {
      walk(full);
    } else if (stat.isFile()) {
      const ext = path.extname(name).toLowerCase();
      if (!exts.has(ext)) return;
      const content = fs.readFileSync(full);
      if (content.indexOf('\r\n') !== -1) {
        bad.push(full);
      }
    }
  }
}

walk(root);

if (bad.length) {
  console.error('CRLF (\r\n) sequences found in the following files:');
  bad.forEach(f => console.error(' - ' + f));
  console.error('\nPlease normalize line endings (e.g. `git add --renormalize .`), or update .gitattributes.');
  process.exit(1);
} else {
  console.log('No CRLF sequences found in checked files.');
  process.exit(0);
}
