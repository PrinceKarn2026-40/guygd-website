const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Remove printMemberProfile function entirely
c = c.replace(/function printMemberProfile\(id\)[\s\S]*?^}/m, '');

// Remove printMemberCard function entirely  
c = c.replace(/function printMemberCard\(id\)[\s\S]*?^}/m, '');

// Remove printIDCard function entirely
c = c.replace(/function printIDCard\(\)[\s\S]*?^}/m, '');

// Add simple replacements before the closing </script>
const simple = `
function printMemberProfile(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;
  window.open('/api/members/' + id, '_blank');
  alert('Print feature: Member ' + m.full_name + ' (ID: ' + (m.member_id || id) + ')');
}

function printMemberCard(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;
  alert('ID Card: ' + m.full_name + '\\nMember ID: ' + (m.member_id || 'GUYGD-' + id) + '\\nStatus: ' + m.status);
}

function printIDCard() {
  alert('Use the Print button in your browser to print the ID card preview.');
}
`;

c = c.replace('</script>\n</body>', simple + '\n</script>\n</body>');

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('done');
