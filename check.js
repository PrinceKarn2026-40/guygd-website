const fs = require('fs');
const c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');
const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
const js = scripts[1].replace(/<\/?script>/g, '');
const lines = js.split('\n');
for (let i = 610; i <= 620; i++) {
  console.log(i + 1, JSON.stringify(lines[i]));
}
