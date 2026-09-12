/**
 * M TECHNOVATE SOLUTIONS — Firebase Firestore Data Migration & Seed Script
 * Migrates authentic data from SQLite into Firebase Firestore collections:
 * - websiteContent/company_profile
 * - services
 * - jobs
 * - emailTemplates
 * - settings
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'server', 'data', 'mtechnovate.sqlite');
if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

const sqliteDb = new DatabaseSync(dbPath);

async function migrateData() {
  console.log('====================================================');
  console.log('  M TECHNOVATE -> FIREBASE FIRESTORE DATA MIGRATION');
  console.log('====================================================\n');

  // 1. Read Company Profile
  const profile = sqliteDb.prepare('SELECT * FROM company_profile WHERE id = 1').get();
  console.log('✓ Read company profile from SQLite:', profile?.company_name, '-', profile?.ceo_name);

  // 2. Read Services
  const services = sqliteDb.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
  console.log(`✓ Read ${services.length} services from SQLite`);

  // 3. Read Jobs
  const jobs = sqliteDb.prepare('SELECT * FROM jobs ORDER BY id ASC').all();
  console.log(`✓ Read ${jobs.length} career vacancies from SQLite`);

  // 4. Read Email Templates
  const templates = sqliteDb.prepare('SELECT * FROM email_templates').all();
  console.log(`✓ Read ${templates.length} email templates from SQLite`);

  // 5. Prepare Firestore payload
  const firestoreExport = {
    websiteContent: {
      company_profile: {
        ...profile,
        updatedAt: new Date().toISOString()
      }
    },
    services: services.map(s => ({
      id: String(s.id),
      ...s,
      tech_tags: typeof s.tech_tags === 'string' ? JSON.parse(s.tech_tags || '[]') : s.tech_tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    jobs: jobs.map(j => ({
      id: String(j.id),
      ...j,
      requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements || '[]') : j.requirements,
      responsibilities: typeof j.responsibilities === 'string' ? JSON.parse(j.responsibilities || '[]') : j.responsibilities,
      skills_array: j.skills ? j.skills.split(',').map(s => s.trim()) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    emailTemplates: templates.map(t => ({
      id: t.template_type,
      ...t,
      updatedAt: new Date().toISOString()
    }))
  };

  const exportPath = path.join(__dirname, '..', 'server', 'data', 'firestore_seed.json');
  fs.writeFileSync(exportPath, JSON.stringify(firestoreExport, null, 2));
  console.log(`\n✓ Firestore seed data successfully compiled to: ${exportPath}`);
  console.log('====================================================');
  console.log('  MIGRATION EXPORT COMPLETE: READY FOR FIRESTORE SYNC');
  console.log('====================================================\n');
}

migrateData().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
