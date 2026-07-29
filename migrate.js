const pool = require('./server/config/db');

async function migrate() {
  const queries = [
    'ALTER TABLE news ALTER COLUMN image_url TYPE TEXT',
    'ALTER TABLE events ALTER COLUMN image_url TYPE TEXT',
    'ALTER TABLE gallery ALTER COLUMN image_url TYPE TEXT',
    'ALTER TABLE members ALTER COLUMN profile_photo TYPE TEXT',
    'ALTER TABLE team ALTER COLUMN photo TYPE TEXT',
    'ALTER TABLE programs ALTER COLUMN image_url TYPE TEXT',
    'ALTER TABLE donations ADD COLUMN IF NOT EXISTS screenshot_url TEXT',
  ];
  for (const q of queries) {
    try {
      await pool.query(q);
      console.log('OK:', q);
    } catch(e) {
      console.log('SKIP:', e.message);
    }
  }
  await pool.end();
  console.log('Migration complete');
}

migrate();
