const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');
const tmp = os.tmpdir() + '/test.js';

const c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');
const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
const js = scripts[1].replace(/<\/?script>/g, '');
fs.writeFileSync(tmp, js);

try {
  execSync('node --check ' + tmp, { stdio: 'pipe' });
  console.log('OK');
} catch(e) {
  const lines = e.stderr.toString().split('\n');
  const lineNum = parseInt((lines[0].match(/:(\d+)$/) || [])[1]);
  console.log('Error at line:', lineNum);
  const jsLines = js.split('\n');
  for (let i = Math.max(0, lineNum - 5); i < lineNum + 3; i++) {
    console.log(i + 1, JSON.stringify(jsLines[i]));
  }
}
