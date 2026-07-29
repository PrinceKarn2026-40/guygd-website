const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');
const tmp = os.tmpdir() + '/test.js';

const c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');
const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
console.log('Script blocks found:', scripts.length);

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
