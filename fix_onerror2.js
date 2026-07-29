const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Remove onerror attributes from img tags inside JS string concatenations
// These are inside + '...' string parts
c = c.replaceAll(
  `\" onerror=\"this.style.display='none'\"`,
  `\"`
);

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');

// Validate
const tmp = os.tmpdir() + '/t.js';
const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
scripts.forEach((s, i) => {
  const js = s.replace(/<\/?script>/g, '');
  fs.writeFileSync(tmp, js);
  try { execSync('node --check ' + tmp, {stdio:'pipe'}); console.log('Block', i+1, 'OK'); }
  catch(e) { console.log('Block', i+1, 'ERROR:', e.stderr.toString().substring(0,300)); }
});
