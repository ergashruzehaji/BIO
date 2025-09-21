#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'index.html');
let src;
try {
  src = fs.readFileSync(file, 'utf8');
} catch (e) {
  console.error('error: could not read index.html');
  process.exit(2);
}

// look for the exact string 'About Me' (case-sensitive)
const exact = 'About Me';
const occurrences = (src.match(new RegExp(exact, 'g')) || []).length;

if (occurrences === 0) {
  console.error(`error: exact string '${exact}' not found in index.html`);
  process.exit(1);
}

console.log(`ok: found '${exact}' ${occurrences} time(s)`);
process.exit(0);
