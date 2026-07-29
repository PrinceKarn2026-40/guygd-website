const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Replace the stub print functions with real ones using string concatenation
const oldPrintCard = `function printMemberCard(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;
  alert('ID Card: ' + m.full_name + '\\nMember ID: ' + (m.member_id || 'GUYGD-' + id) + '\\nStatus: ' + m.status);
}`;

const newPrintCard = `function printMemberCard(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;
  const memberId = m.member_id || ('GUYGD-' + new Date().getFullYear() + '-' + String(m.id).padStart(4,'0'));
  const expiry = new Date(); expiry.setFullYear(expiry.getFullYear() + 1);
  const expiryStr = expiry.toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'});
  const origin = window.location.origin;
  const photo = m.profile_photo
    ? '<img src="' + m.profile_photo + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #d4a017;"/>'
    : '<div style="width:80px;height:80px;border-radius:50%;background:#2d6a4f;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#fff;border:3px solid #d4a017;">&#128100;</div>';
  const html = '<!DOCTYPE html><html><head><title>ID Card - ' + m.full_name + '</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#e5e7eb;font-family:Segoe UI,Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:30px 20px;gap:24px;}'
    + '.card{width:420px;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.2);}'
    + '.ch{background:linear-gradient(135deg,#052e16,#15803d);padding:14px 18px;display:flex;align-items:center;gap:12px;}'
    + '.cb{background:#fff;padding:20px 22px;display:flex;gap:18px;align-items:flex-start;}'
    + '.cf{background:linear-gradient(135deg,#052e16,#15803d);padding:8px 18px;display:flex;justify-content:space-between;}'
    + 'table{width:100%;border-collapse:collapse;font-size:0.78rem;}td{padding:4px 0;}'
    + '@media print{body{background:#fff;padding:10px;}.card{box-shadow:none;}.no-print{display:none;}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}'
    + '</style></head><body>'
    + '<button class="no-print" onclick="window.print()" style="padding:10px 28px;background:#2d6a4f;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;margin-bottom:8px;">&#128424; Print</button>'
    + '<div class="card">'
    + '<div class="ch">'
    + '<div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid #d4a017;flex-shrink:0;background:#d4a017;display:flex;align-items:center;justify-content:center;">'
    + '<img src="' + origin + '/assets/images/guygd-logo.png" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'"/>'
    + '</div>'
    + '<div style="flex:1;"><div style="color:#fff;font-size:0.9rem;font-weight:800;letter-spacing:1.5px;">GUYGD</div>'
    + '<div style="color:rgba(255,255,255,0.65);font-size:0.62rem;">Gbeh-lay United Youths for Growth and Development</div></div>'
    + '<div style="text-align:right;"><div style="color:rgba(255,255,255,0.55);font-size:0.58rem;text-transform:uppercase;letter-spacing:1px;">Membership Card</div>'
    + '<div style="color:#d4a017;font-weight:800;font-size:0.78rem;font-family:monospace;margin-top:2px;">' + memberId + '</div></div>'
    + '</div>'
    + '<div class="cb">'
    + '<div style="flex-shrink:0;text-align:center;">' + photo
    + '<div style="margin-top:8px;background:' + (m.status==='active'?'#d4edda':'#fff3cd') + ';color:' + (m.status==='active'?'#155724':'#856404') + ';padding:3px 10px;border-radius:20px;font-size:0.65rem;font-weight:700;text-transform:uppercase;display:inline-block;">' + m.status + '</div>'
    + '</div>'
    + '<div style="flex:1;">'
    + '<div style="font-size:1.1rem;font-weight:800;color:#052e16;line-height:1.2;">' + m.full_name + '</div>'
    + '<div style="color:#15803d;font-size:0.72rem;font-weight:600;margin:3px 0 10px;">' + (m.membership_type || 'Regular Member') + '</div>'
    + '<table>'
    + '<tr><td style="color:#6b7280;width:42%;">Member ID</td><td style="font-weight:700;font-family:monospace;color:#052e16;">' + memberId + '</td></tr>'
    + '<tr><td style="color:#6b7280;">Gender</td><td>' + (m.gender || '-') + '</td></tr>'
    + '<tr><td style="color:#6b7280;">Phone</td><td>' + (m.phone || '-') + '</td></tr>'
    + '<tr><td style="color:#6b7280;">County</td><td>' + (m.county || '-') + '</td></tr>'
    + '<tr><td style="color:#6b7280;">Joined</td><td>' + (m.joined_at ? new Date(m.joined_at).toLocaleDateString() : '-') + '</td></tr>'
    + '<tr><td style="color:#6b7280;">Expires</td><td style="color:#dc2626;font-weight:600;">' + expiryStr + '</td></tr>'
    + '</table></div></div>'
    + '<div class="cf">'
    + '<div style="font-size:0.6rem;color:rgba(255,255,255,0.6);font-style:italic;">Voice of the Voiceless &mdash; Est. May 14, 2023</div>'
    + '<div style="font-size:0.6rem;color:rgba(255,255,255,0.5);">info@guygd.org</div>'
    + '</div></div>'
    + '</body></html>';
  printHTML(html);
}`;

const oldPrintProfile = `function printMemberProfile(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;
  window.open('/api/members/' + id, '_blank');
  alert('Print feature: Member ' + m.full_name + ' (ID: ' + (m.member_id || id) + ')');
}`;

const newPrintProfile = `function printMemberProfile(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;
  const memberId = m.member_id || ('GUYGD-' + new Date().getFullYear() + '-' + String(m.id).padStart(4,'0'));
  const origin = window.location.origin;
  const photo = m.profile_photo
    ? '<img src="' + m.profile_photo + '" style="width:90px;height:90px;border-radius:8px;object-fit:cover;border:3px solid #15803d;"/>'
    : '<div style="width:90px;height:90px;border-radius:8px;background:#2d6a4f;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#fff;">&#128100;</div>';
  const row = function(label, val) {
    if (!val) return '';
    return '<tr><td style="padding:6px 12px;color:#6b7280;font-size:0.78rem;font-weight:600;text-transform:uppercase;width:36%;border-bottom:1px solid #f3f4f6;">' + label + '</td>'
      + '<td style="padding:6px 12px;color:#1a1f36;font-size:0.85rem;border-bottom:1px solid #f3f4f6;">' + val + '</td></tr>';
  };
  const html = '<!DOCTYPE html><html><head><title>Profile - ' + m.full_name + '</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#f3f4f6;font-family:Segoe UI,Arial,sans-serif;padding:24px;}'
    + '.page{background:#fff;max-width:780px;margin:0 auto;padding:20px 24px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.1);}'
    + '.sec{margin-bottom:16px;}.sec-title{background:#f0fdf4;border-left:4px solid #15803d;padding:6px 14px;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#15803d;}'
    + 'table{width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;}'
    + '@media print{body{background:#fff;padding:0;}.page{box-shadow:none;}.no-print{display:none;}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}'
    + '</style></head><body>'
    + '<div style="max-width:780px;margin:0 auto 16px;text-align:right;" class="no-print">'
    + '<button onclick="window.print()" style="padding:10px 28px;background:#2d6a4f;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">&#128424; Print / Save PDF</button>'
    + '</div>'
    + '<div class="page">'
    + '<div style="background:linear-gradient(135deg,#052e16,#15803d);border-radius:10px;padding:16px 20px;display:flex;align-items:center;gap:16px;margin-bottom:18px;">'
    + '<div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid #d4a017;flex-shrink:0;background:#d4a017;display:flex;align-items:center;justify-content:center;">'
    + '<img src="' + origin + '/assets/images/guygd-logo.png" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'"/>'
    + '</div>'
    + '<div style="flex:1;"><div style="color:#fff;font-size:1.1rem;font-weight:800;letter-spacing:2px;">GUYGD</div>'
    + '<div style="color:rgba(255,255,255,0.7);font-size:0.65rem;">Gbeh-lay United Youths for Growth and Development</div></div>'
    + '<div style="text-align:right;"><div style="color:#d4a017;font-weight:800;font-family:monospace;font-size:0.85rem;">' + memberId + '</div>'
    + '<div style="color:rgba(255,255,255,0.5);font-size:0.62rem;margin-top:3px;">Printed: ' + new Date().toLocaleDateString() + '</div></div>'
    + '</div>'
    + '<div style="display:flex;gap:16px;align-items:center;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:16px;background:#fafafa;">'
    + photo
    + '<div style="flex:1;">'
    + '<div style="font-size:1.4rem;font-weight:800;color:#052e16;">' + m.full_name + '</div>'
    + '<div style="color:#15803d;font-weight:600;font-size:0.85rem;margin-top:3px;">' + (m.membership_type || 'Regular Member') + '</div>'
    + '<div style="display:flex;gap:8px;margin-top:8px;">'
    + '<span style="background:' + (m.status==='active'?'#d4edda':'#fff3cd') + ';color:' + (m.status==='active'?'#155724':'#856404') + ';padding:3px 12px;border-radius:20px;font-size:0.72rem;font-weight:700;">' + m.status + '</span>'
    + '</div></div></div>'
    + '<div class="sec"><div class="sec-title">Personal Information</div><table>'
    + row('Full Name', m.full_name) + row('Gender', m.gender)
    + row('Date of Birth', m.date_of_birth ? new Date(m.date_of_birth).toLocaleDateString() : null)
    + row('Nationality', m.nationality) + row('Phone', m.phone) + row('Email', m.email)
    + '</table></div>'
    + '<div class="sec"><div class="sec-title">Location</div><table>'
    + row('Address', m.address) + row('Town', m.town) + row('District', m.district) + row('County', m.county)
    + '</table></div>'
    + '<div class="sec"><div class="sec-title">Background</div><table>'
    + row('Occupation', m.occupation) + row('Education Level', m.education_level)
    + '</table></div>'
    + '<div class="sec"><div class="sec-title">Membership Details</div><table>'
    + row('Member ID', memberId) + row('Membership Type', m.membership_type)
    + row('Role', (m.role||'').replace('_',' ')) + row('Status', m.status)
    + row('Date Joined', m.joined_at ? new Date(m.joined_at).toLocaleDateString() : '-')
    + '</table></div>'
    + '<div style="margin-top:16px;padding-top:10px;border-top:1px dashed #d1fae5;display:flex;justify-content:space-between;">'
    + '<div style="font-size:0.65rem;color:#9ca3af;">Confidential &mdash; issued by GUYGD Administration</div>'
    + '<div style="font-size:0.65rem;color:#9ca3af;">Printed: ' + new Date().toLocaleString() + '</div>'
    + '</div></div></body></html>';
  printHTML(html);
}`;

const oldPrintIDCard = `function printIDCard() {
  alert('Use the Print button in your browser to print the ID card preview.');
}`;

const newPrintIDCard = `function printIDCard() {
  const preview = document.getElementById('idc-preview');
  if (!preview) return;
  const html = preview.innerHTML;
  const siteUrl = window.location.origin;
  const page = '<!DOCTYPE html><html><head><title>ID Card</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;}'
    + '.card{width:320px;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.25);}'
    + '@media print{body{background:#fff;}.card{box-shadow:none;}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}'
    + '</style></head><body>'
    + '<div class="card">' + html + '</div>'
    + '</body></html>';
  printHTML(page);
}`;

c = c.replace(oldPrintCard, newPrintCard);
c = c.replace(oldPrintProfile, newPrintProfile);
c = c.replace(oldPrintIDCard, newPrintIDCard);

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');

// Validate
const { execSync } = require('child_process');
const os = require('os');
const tmp = os.tmpdir() + '/t.js';
const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
scripts.forEach((s, i) => {
  const js = s.replace(/<\/?script>/g, '');
  fs.writeFileSync(tmp, js);
  try { execSync('node --check ' + tmp, {stdio:'pipe'}); console.log('Block', i+1, 'OK'); }
  catch(e) { console.log('Block', i+1, 'ERROR:', e.stderr.toString().split('\n')[0]); }
});
