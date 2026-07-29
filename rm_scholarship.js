const fs = require('fs');
let c = fs.readFileSync('client/src/pages/membership.html', 'utf8');
const before = c.length;
// Remove the entire scholarship feature-item line
c = c.replace(/\s*<div class="feature-item"><div class="feature-icon">[^<]*<\/div><span>Access exclusive scholarship opportunities<\/span><\/div>/g, '');
fs.writeFileSync('client/src/pages/membership.html', c, 'utf8');
console.log('removed, chars diff:', before - c.length);
