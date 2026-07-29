const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Replace all escaped closing script tags inside template literals
c = c.replaceAll('<\\/script>', '<\\/scr"+"ipt>');

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('done');
