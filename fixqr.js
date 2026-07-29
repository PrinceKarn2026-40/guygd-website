const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

const fnStart = c.indexOf('function printIDCard()');
const fnEnd = c.indexOf('\n}\n', fnStart) + 3;

const newFn = `function printIDCard() {
  const preview = document.getElementById('idc-preview');
  if (!preview) return;
  const siteUrl = window.location.origin;
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=' + encodeURIComponent(siteUrl) + '&color=052e16&bgcolor=ffffff';
  let html = preview.innerHTML;
  const qrBase = 'https://api.qrserver.com/v1/create-qr-code/';
  const qrStart = html.indexOf(qrBase);
  if (qrStart !== -1) {
    const qrEnd = html.indexOf('"', qrStart);
    html = html.substring(0, qrStart) + qrUrl + html.substring(qrEnd);
  }
  const page = '<!DOCTYPE html><html><head><title>ID Card</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;}'
    + '.card{width:320px;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.25);}img{max-width:100%;display:block;}'
    + '@media print{body{background:#fff;}.card{box-shadow:none;}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}'
    + '</style></head><body>'
    + '<div class="card">' + html + '</div>'
    + '</body></html>';
  printHTML(page);
}
`;

c = c.substring(0, fnStart) + newFn + c.substring(fnEnd);
fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('done');
