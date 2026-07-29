const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Replace corrupted emoji placeholders with HTML entities based on context
const replacements = [
  // Sidebar avatar icon
  [/<div class="sidebar-avatar">\?\?<\/div>/, '<div class="sidebar-avatar">&#128100;</div>'],
  // Sidebar nav icons
  [/<span class="icon">\?\?<\/span> Dashboard/, '<span class="icon">&#128202;</span> Dashboard'],
  [/<span class="icon">\?\?<\/span> Applications/, '<span class="icon">&#127891;</span> Applications'],
  [/<span class="icon">\?\?<\/span> Members/, '<span class="icon">&#128101;</span> Members'],
  [/<span class="icon">\?\?<\/span> Events/, '<span class="icon">&#128197;</span> Events'],
  [/<span class="icon">\?\?<\/span> News/, '<span class="icon">&#128240;</span> News'],
  [/<span class="icon">\?\?\?<\/span> Gallery/, '<span class="icon">&#128247;</span> Gallery'],
  [/<span class="icon">\?\?<\/span> Projects/, '<span class="icon">&#128203;</span> Projects'],
  [/<span class="icon">\?\?<\/span> Our Team/, '<span class="icon">&#128101;</span> Our Team'],
  [/<span class="icon">\?\?<\/span> Donations/, '<span class="icon">&#128176;</span> Donations'],
  [/<span class="icon">\?\?<\/span> Messages/, '<span class="icon">&#9993;</span> Messages'],
  [/<span class="icon">\?\?<\/span> Notifications/, '<span class="icon">&#128276;</span> Notifications'],
  [/<span class="icon">\?\?<\/span> Reports/, '<span class="icon">&#128200;</span> Reports'],
  [/<span class="icon">\?\?<\/span> Users/, '<span class="icon">&#128100;</span> Users'],
  [/<span class="icon">\?\?<\/span> ID Card/, '<span class="icon">&#128196;</span> ID Card'],
  [/<span class="icon">\?\?<\/span> Settings/, '<span class="icon">&#9881;</span> Settings'],
  // Logout link
  [/<span class="icon">\?\?<\/span> Logout/, '<span class="icon">&#128682;</span> Logout'],
  // Topbar avatar
  [/<div class="topbar-avatar" id="topbar-avatar">\?\?<\/div>/, '<div class="topbar-avatar" id="topbar-avatar">&#128100;</div>'],
  // Topbar notification bell
  [/\?\?<span class="notif-badge"/, '&#128276;<span class="notif-badge"'],
  // Topbar logout button
  [/>\?\? Logout<\/button>/, '>&#128682; Logout</button>'],
  // Mobile menu
  [/>\?\? Logout<\/button>/, '>&#128682; Logout</button>'],
];

replacements.forEach(([from, to]) => {
  c = c.replace(from, to);
});

// Replace any remaining ?? that are standalone emojis
c = c.replace(/>\?\?</g, '>&#128100;<');

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('done, remaining ??:', (c.match(/\?\?/g)||[]).length);
