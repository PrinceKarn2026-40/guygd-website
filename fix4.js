const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Replace all opening <script> tags that appear inside template literals
// These are identified by being followed by JS code (not src= attribute)
// Strategy: replace every <script> that is NOT a <script src=
const lines = c.split('\n');
const result = [];
let inTemplateLiteral = false;
let backtickCount = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Count backticks to track if we're inside a template literal
  // Simple heuristic: if line contains printHTML or _html, we're in print context
  if (line.includes('const _html') || line.includes('let _html')) {
    inTemplateLiteral = true;
  }
  if (inTemplateLiteral && line.trim() === '`);') {
    inTemplateLiteral = false;
  }
  
  if (inTemplateLiteral) {
    // Fix opening script tags
    line = line.replace(/^(\s*)<script>$/, '$1<scr"+"ipt>');
    // Fix closing script tags  
    line = line.replace(/^(\s*)<\\\/script>$/, '$1<\\/scr"+"ipt>');
    line = line.replace(/^(\s*)<\\\/scr"\+"ipt>$/, '$1<\\/scr"+"ipt>');
  }
  
  result.push(line);
}

c = result.join('\n');
fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');

// Validate
const tmp = os.tmpdir() + '/t.js';
const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
console.log('Script blocks:', scripts.length);
scripts.forEach((s, i) => {
  const js = s.replace(/<\/?script>/g, '');
  fs.writeFileSync(tmp, js);
  try {
    execSync('node --check ' + tmp, { stdio: 'pipe' });
    console.log('Block', i + 1, 'OK');
  } catch(e) {
    const err = e.stderr.toString().split('\n')[0];
    console.log('Block', i + 1, 'ERROR:', err);
  }
});
