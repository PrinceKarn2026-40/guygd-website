const fs = require('fs');
let c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

c = c.replaceAll('btn-primary">?? Save Event</button>', 'btn-primary">&#128190; Save Event</button>');
c = c.replaceAll('btn-primary">?? Save</button>', 'btn-primary">&#128190; Save</button>');
c = c.replaceAll('btn-primary">?? Save Project</button>', 'btn-primary">&#128190; Save Project</button>');

fs.writeFileSync('client/src/pages/dashboard/admin.html', c, 'utf8');
console.log('remaining ??:', (c.match(/\?\?/g)||[]).length);
