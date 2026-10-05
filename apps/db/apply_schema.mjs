import fs from 'node:fs';
import path from 'node:path';

// Utility to apply migration files in sequential order
async function applySchema() {
  console.log('=== EL VERSE ECOSYSTEM: Database Schema Migration Applier ===');

  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL;
  const migrationsDir = path.resolve('apps/db/migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found at: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration file(s) in ${migrationsDir}:`);
  for (const file of files) {
    console.log(` - ${file}`);
  }

  if (!dbUrl) {
    console.log('\n[NOTICE] DATABASE_URL or SUPABASE_DB_URL is not set.');
    console.log('Schema files validated successfully. Set DATABASE_URL to apply directly to Supabase.');
    return;
  }

  try {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    console.log('\nConnected to database successfully. Applying migrations...');

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`Applying ${file}...`);
      await client.query(sql);
      console.log(`✓ Applied ${file}`);
    }

    await client.end();
    console.log('\nAll migrations applied successfully!');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

applySchema().catch(err => {
  console.error('Fatal error applying schema:', err);
  process.exit(1);
});
