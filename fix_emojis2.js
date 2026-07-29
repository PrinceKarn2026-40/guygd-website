const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

const fixes = [
  // Buttons
  ["'>?? Save Event</button>", "'>&#128190; Save Event</button>"],
  ["'>?? Save</button>", "'>&#128190; Save</button>"],
  ["'>?? Save Project</button>", "'>&#128190; Save Project</button>"],
  // Empty state icons
  ['class="empty-icon">???</div><p>No images yet.</p>', 'class="empty-icon">&#128247;</div><p>No images yet.</p>'],
  // Report card headers
  ['<h4>?? Membership Summary</h4>', '<h4>&#128203; Membership Summary</h4>'],
  ['<h4>?? Scholarship Summary</h4>', '<h4>&#127891; Scholarship Summary</h4>'],
  ['<h4>?? Donation Summary</h4>', '<h4>&#128176; Donation Summary</h4>'],
  ['<h4>?? Events Summary</h4>', '<h4>&#128197; Events Summary</h4>'],
  // DataTable buttons
  ["text: '?? Excel'", "text: '&#11015; Excel'"],
  ["text: '?? CSV'", "text: '&#11015; CSV'"],
  ["text: '??? Print'", "text: '&#128424; Print'"],
  // Error message
  ["'?? API Error: '", "'&#9888; API Error: '"],
  // Delete buttons in table rows
  [">??? Delete</button></td>", ">&#128465; Delete</button></td>"],
  [">??? Delete</button></td>\n    </tr>`).joi", ">&#128465; Delete</button></td>\n    </tr>`).joi"],
  // Gallery empty state in JS string
  ['class=\\"empty-icon\\">???</div><p>No images yet.</p>', 'class=\\"empty-icon\\">&#128247;</div><p>No images yet.</p>'],
];

fixes.forEach(([from, to]) => {
  c = c.replaceAll(from, to);
});

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('done, remaining ??:', (c.match(/\?\?/g)||[]).length);
console.log('remaining ???:', (c.match(/\?\?\?/g)||[]).length);
