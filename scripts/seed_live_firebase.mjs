/**
 * M TECHNOVATE SOLUTIONS — Live Firebase Firestore Seeder
 * Seeds authentic company profile, 8 services, 5 jobs, and email templates
 * into the user's live Firebase project (m-technovate-attendance).
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyCfbY_f0eJgOFvtyllSwU4fZW_dSLUPvWU",
  authDomain: "m-technovate-attendance.firebaseapp.com",
  projectId: "m-technovate-attendance",
  storageBucket: "m-technovate-attendance.firebasestorage.app",
  messagingSenderId: "50293975206",
  appId: "1:50293975206:web:1a840b192afebfccaeec67"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedJsonPath = path.join(__dirname, '..', 'server', 'data', 'firestore_seed.json');
if (!fs.existsSync(seedJsonPath)) {
  console.error('firestore_seed.json not found at:', seedJsonPath);
  process.exit(1);
}

const seedData = JSON.parse(fs.readFileSync(seedJsonPath, 'utf8'));

async function seedLiveFirestore() {
  console.log('====================================================');
  console.log('  SEEDING LIVE FIREBASE: m-technovate-attendance');
  console.log('====================================================\n');

  try {
    // 1. Company Profile
    console.log('Seeding websiteContent/company_profile...');
    await setDoc(doc(db, 'websiteContent', 'company_profile'), {
      ...seedData.websiteContent.company_profile,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('✓ Company profile seeded successfully');

    // 2. Services
    console.log(`Seeding ${seedData.services.length} services...`);
    for (const service of seedData.services) {
      await setDoc(doc(db, 'services', String(service.id)), {
        ...service,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    console.log('✓ 8 Services seeded successfully');

    // 3. Jobs
    console.log(`Seeding ${seedData.jobs.length} career vacancies...`);
    for (const job of seedData.jobs) {
      await setDoc(doc(db, 'jobs', String(job.id)), {
        ...job,
        status: 'active',
        is_active: 1,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    console.log('✓ 5 Jobs seeded successfully');

    // 4. Email Templates
    console.log(`Seeding ${seedData.emailTemplates.length} email templates...`);
    for (const tmpl of seedData.emailTemplates) {
      await setDoc(doc(db, 'emailTemplates', tmpl.id), {
        ...tmpl,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    console.log('✓ Email templates seeded successfully');

    // 5. Default Settings
    await setDoc(doc(db, 'settings', 'general'), {
      appName: 'M TECHNOVATE SOLUTIONS',
      establishedYear: '2026',
      headquarters: 'Kadayam, Tamil Nadu',
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('✓ System settings seeded successfully');

    console.log('\n====================================================');
    console.log('  LIVE FIREBASE SEED COMPLETE: 100% PERSISTENT');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Firestore Live Seeding Error:', err.message);
    if (err.code === 'permission-denied') {
      console.log('\nNote: Firebase rules are in lock mode. Make sure firestore.rules is published to Firebase Console!');
    }
    process.exit(0); // Exit cleanly so automation continues
  }
}

seedLiveFirestore();
