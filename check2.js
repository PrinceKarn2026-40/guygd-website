const fs = require('fs');
const c = fs.readFileSync('client/src/pages/dashboard/admin.html', 'utf8');

// Find all </script> occurrences
const matches = [...c.matchAll(/<\/script>/g)];
console.log('Total </script> tags:', matches.length);
matches.forEach((m, i) => {
  const ctx = c.substring(m.index - 50, m.index + 20);
  console.log(i + 1, JSON.stringify(ctx));
});
