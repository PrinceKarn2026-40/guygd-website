const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Find all template literals containing </body></html>
// and replace the inner <script> and </script> tags
const fixes = [
  // opening script tags inside template literals
  [/<script>\n(\s+\/\/ Re-render)/g, '<scr"+"ipt>\n$1'],
  [/<script>\n(\s+var )/g, '<scr"+"ipt>\n$1'],
  [/<script>\n(\s+new QRCode)/g, '<scr"+"ipt>\n$1'],
  [/<script>\n(\s+window\.onload)/g, '<scr"+"ipt>\n$1'],
  // closing script tags inside template literals (escaped versions)
  [/<\\\\/script>/g, '<\\/scr"+"ipt>'],
  [/<\\\\/scr"\\+"ipt>/g, '<\\/scr"+"ipt>'],
];

fixes.forEach(([from, to]) => {
  c = c.replace(from, to);
});

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');

// Now verify
const { execSync } = require('child_process');
const os = require('os');
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
