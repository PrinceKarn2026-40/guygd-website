const fs = require('fs');
const file = 'client/src/pages/dashboard/admin.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Update Members table header — add Member ID column
content = content.replace(
  '<tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>',
  '<tr><th>Member ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>'
);

// 2. Update renderMembers rows — add member_id cell and membership_type, fix colspan
const oldRender = `function renderMembers(list) {
  if (!list.length) {
    document.getElementById('members-body').innerHTML =
      '<tr><td colspan="7" style="text-align:center;color:#6b7280;">No members found.</td></tr>';
    return;
  }
  document.getElementById('members-body').innerHTML = list.map(m => \`
    <tr>
      <td><strong>\${m.full_name}</strong></td>

      <td>\${m.email}</td>

      <td>\${m.phone || '-'}</td>
      <td>\${badge(m.role)}</td>
      <td>\${badge(m.status)}</td>
      <td>\${fmtDate(m.joined_at)}</td>
      <td style="display:flex;gap:4px;flex-wrap:wrap;">
        <button class="btn btn-sm" style="background:#3b82f6;color:#fff;" onclick="viewMember(\${m.id})">👁 View</button>
        <button class="btn btn-sm btn-success" onclick="updateMemberStatus(\${m.id},'active')">✅ Approve</button>
        <button class="btn btn-sm btn-danger"  onclick="updateMemberStatus(\${m.id},'suspended')">❌ Reject</button>
        <button class="btn btn-sm" style="background:#dc2626;color:#fff;" onclick="deleteMember(\${m.id},'\${m.full_name}')">🗑️ Delete</button>
      </td>
    </tr>\`).join('');
  dtInit('dt-members', { columnDefs: [{ orderable: false, targets: 6 }] });
}`;

const newRender = `function renderMembers(list) {
  if (!list.length) {
    document.getElementById('members-body').innerHTML =
      '<tr><td colspan="9" style="text-align:center;color:#6b7280;">No members found.</td></tr>';
    return;
  }
  document.getElementById('members-body').innerHTML = list.map(m => \`
    <tr>
      <td><span style="font-family:monospace;font-size:0.8rem;color:#2d6a4f;font-weight:700;">\${m.member_id || '-'}</span></td>
      <td><strong>\${m.full_name}</strong></td>
      <td>\${m.email}</td>
      <td>\${m.phone || '-'}</td>
      <td>\${m.membership_type || 'Regular Member'}</td>
      <td>\${badge(m.role)}</td>
      <td>\${badge(m.status)}</td>
      <td>\${fmtDate(m.joined_at)}</td>
      <td style="display:flex;gap:4px;flex-wrap:wrap;">
        <button class="btn btn-sm" style="background:#3b82f6;color:#fff;" onclick="viewMember(\${m.id})">&#128065; View</button>
        <button class="btn btn-sm btn-success" onclick="updateMemberStatus(\${m.id},'active')">&#10003; Approve</button>
        <button class="btn btn-sm btn-danger"  onclick="updateMemberStatus(\${m.id},'suspended')">&#10007; Suspend</button>
        <button class="btn btn-sm" style="background:#dc2626;color:#fff;" onclick="deleteMember(\${m.id},'\${m.full_name.replace(/'/g,'')}')">&#128465; Delete</button>
      </td>
    </tr>\`).join('');
  dtInit('dt-members', { columnDefs: [{ orderable: false, targets: 8 }] });
}`;

if (content.includes('function renderMembers(list)')) {
  // Find and replace the full function block
  const start = content.indexOf('function renderMembers(list)');
  const end = content.indexOf('\ndtInit(\'dt-members\'', start) + content.slice(content.indexOf('\ndtInit(\'dt-members\'', start)).indexOf('\n}\n') + 3;
  // Use regex for reliable replacement
  content = content.replace(
    /function renderMembers\(list\) \{[\s\S]*?dtInit\('dt-members'[\s\S]*?\}(?=\nfunction searchMembers)/,
    newRender
  );
  console.log('renderMembers replaced');
} else {
  console.log('renderMembers NOT found');
}

// 3. Fix loadMembers error colspan
content = content.replace(
  /colspan="7"[^>]*>Loading\.\.\./,
  'colspan="9" style="text-align:center;color:#6b7280;">Loading...'
);
content = content.replace(
  /colspan="7"[^>]*>No members registered yet\./,
  'colspan="9" style="text-align:center;color:#6b7280;">No members registered yet.'
);

// 4. Fix loadMembers error row colspan
content = content.replace(
  /colspan="7"[^>]*>&#9888;/,
  'colspan="9" style="text-align:center;color:#e74c3c;padding:16px;">&#9888;'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
