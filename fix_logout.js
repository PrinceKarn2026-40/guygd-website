const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Remove the red logout button from topbar
c = c.replace(/<button onclick="logout\(\)" style="background:#ef4444;color:#fff;border:none;border-radius:8px;padding:7px 14px;font-size:0.8rem;font-weight:600;cursor:pointer;margin-left:10px;white-space:nowrap;">&#128682; Logout<\/button>/, '');

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('done');
