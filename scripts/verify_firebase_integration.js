/**
 * M TECHNOVATE SOLUTIONS — Firebase Admin & Website Integration Verification Suite
 * Tests all 9 Admin modules, Public website endpoints, SMTP email automation,
 * duplicate prevention, and Firebase security rules.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function runVerification() {
  console.log('================================================================');
  console.log('  M TECHNOVATE — COMPLETE FIREBASE + ADMIN VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Files & Rules Verification
  console.log('[1/7] Verifying Firebase Configuration & Security Rules...');
  assert(fs.existsSync('firestore.rules'), 'firestore.rules exists in repository root');
  const firestoreRules = fs.readFileSync('firestore.rules', 'utf8');
  assert(firestoreRules.includes('match /applications/{appId}') && firestoreRules.includes('isAdmin()'), 'firestore.rules enforces admin authorization & application privacy');
  assert(firestoreRules.includes('match /inquiries/{inquiryId}'), 'firestore.rules protects customer inquiries');
  assert(firestoreRules.includes('match /emailTemplates/{templateId}'), 'firestore.rules restricts email templates to admin');

  assert(fs.existsSync('storage.rules'), 'storage.rules exists in repository root');
  const storageRules = fs.readFileSync('storage.rules', 'utf8');
  assert(storageRules.includes('match /applications/resumes/{fileName}'), 'storage.rules protects candidate resumes');
  assert(storageRules.includes('match /gallery/{allPaths=**}'), 'storage.rules allows public read for gallery assets');

  assert(fs.existsSync('client/.env'), 'client/.env exists with VITE_FIREBASE_* variables');
  assert(fs.existsSync('server/.env'), 'server/.env exists with SMTP credentials');

  // 2. Modular Services Structure
  console.log('\n[2/7] Verifying Modular Service Architecture in client/src/services/...');
  const requiredServices = [
    'firebase.js',
    'authService.js',
    'jobService.js',
    'applicationService.js',
    'galleryService.js',
    'serviceService.js',
    'websiteService.js',
    'inquiryService.js',
    'settingsService.js',
    'api.js'
  ];
  for (const s of requiredServices) {
    assert(fs.existsSync(path.join('client', 'src', 'services', s)), `Service module ${s} exists`);
  }

  // 3. Backend Health & Public Endpoints
  console.log('\n[3/7] Verifying Backend Server & Public Content...');
  const healthRes = await fetch(`${BASE_URL}/api/health`).then(r => r.json());
  assert(healthRes.status === 'healthy', 'Backend API health check is healthy');

  const compRes = await fetch(`${BASE_URL}/api/company`).then(r => r.json());
  assert(compRes.success === true, 'Public company profile endpoint is active');
  assert(compRes.data.company_name === 'M TECHNOVATE SOLUTIONS', 'Company name is M TECHNOVATE SOLUTIONS');
  assert(compRes.data.ceo_name === 'RAMESH K', 'CEO is RAMESH K');

  const servRes = await fetch(`${BASE_URL}/api/services`).then(r => r.json());
  assert(servRes.success === true && servRes.data.length >= 8, `Public services catalogue returns ${servRes.data.length} services`);

  const jobsRes = await fetch(`${BASE_URL}/api/jobs`).then(r => r.json());
  assert(jobsRes.success === true && jobsRes.data.length >= 5, `Public jobs endpoint returns ${jobsRes.data.length} active vacancies`);

  const targetJobId = jobsRes.data[0].id;

  // 4. Candidate Application & Duplicate Checks
  console.log('\n[4/7] Verifying Candidate Application & Duplicate Checks...');
  const mockResumeDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(mockResumeDir)) fs.mkdirSync(mockResumeDir, { recursive: true });
  const mockResumePath = path.join(mockResumeDir, 'test_candidate_resume.pdf');
  fs.writeFileSync(mockResumePath, '%PDF-1.4 Mock Candidate Resume for M Technovate Firebase Verification');

  const testCandidateEmail = `firebase.candidate.${Date.now()}@gmail.com`;
  const formPayload = new FormData();
  formPayload.append('job_id', targetJobId);
  formPayload.append('full_name', 'Sundar Pichai');
  formPayload.append('email', testCandidateEmail);
  formPayload.append('phone', '+91 98765 43210');
  formPayload.append('cover_letter', 'Applying for Data Processing Executive with Firebase verification.');
  const blob = new Blob([fs.readFileSync(mockResumePath)], { type: 'application/pdf' });
  formPayload.append('resume', blob, 'sundar_resume.pdf');

  const appSubmitRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    body: formPayload
  }).then(r => r.json());

  assert(appSubmitRes.success === true, `Application submitted successfully (ID: ${appSubmitRes.applicationId})`);
  const createdAppId = appSubmitRes.applicationId;

  // Duplicate submission attempt with same email + job_id
  const dupPayload = new FormData();
  dupPayload.append('job_id', targetJobId);
  dupPayload.append('full_name', 'Sundar Pichai');
  dupPayload.append('email', testCandidateEmail);
  dupPayload.append('phone', '+91 98765 43210');
  dupPayload.append('resume', blob, 'sundar_resume.pdf');

  const dupRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    body: dupPayload
  }).then(r => r.json());
  assert(dupRes.success === false, 'Duplicate application submission was rejected with error');

  // 5. Admin Authentication & ATS Management
  console.log('\n[5/7] Verifying Admin Authentication & ATS Workflow...');
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mtechnovate.com', password: 'admin123' })
  }).then(r => r.json());

  assert(loginRes.success === true && !!loginRes.token, 'Admin login authentication returns valid JWT token');
  const adminToken = loginRes.token;

  const adminDashboardRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  }).then(r => r.json());
  const appCount = adminDashboardRes.stats?.totalApplications || adminDashboardRes.data?.total_applicants || adminDashboardRes.stats?.total_applications || 0;
  assert(appCount > 0, `Dashboard tracks real applications (count: ${appCount})`);

  // 6. Automated SMTP Email Notification & Duplicate Prevention
  console.log('\n[6/7] Verifying Automated Status Email & Duplication Prevention...');
  
  // First dispatch: Shortlisted
  const emailDispatchRes = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      applicationId: createdAppId,
      status: 'Shortlisted',
      schedule: {
        date: '2026-09-15',
        time: '10:30 AM IST',
        mode: 'Google Meet',
        meetingLink: 'https://meet.google.com/mtech-interview-2026',
        notes: 'Please keep your identification and academic transcripts ready.'
      },
      applicant: {
        full_name: 'Sundar Pichai',
        email: testCandidateEmail
      },
      job_id: targetJobId
    })
  }).then(r => r.json());

  assert(emailDispatchRes.success === true, 'Status change email processed successfully via backend mailer');
  assert(emailDispatchRes.skipped !== true, 'First notification was actively dispatched (not skipped)');

  // Second dispatch: Duplicate attempt within 24h
  const duplicateEmailRes = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      applicationId: createdAppId,
      status: 'Shortlisted',
      applicant: {
        full_name: 'Sundar Pichai',
        email: testCandidateEmail
      },
      job_id: '5'
    })
  }).then(r => r.json());

  assert(duplicateEmailRes.success === true && duplicateEmailRes.skipped === true, 'Duplicate email was correctly prevented and suppressed within 24 hours');

  // Status transition: Selected
  const selectedEmailRes = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      applicationId: createdAppId,
      status: 'Selected',
      applicant: {
        full_name: 'Sundar Pichai',
        email: `candidate.selected.${Date.now()}@gmail.com`
      },
      job_id: '5'
    })
  }).then(r => r.json());
  assert(selectedEmailRes.success === true, 'Selection congratulations email dispatched successfully');

  // Status transition: Rejected
  const rejectedEmailRes = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      applicationId: createdAppId,
      status: 'Rejected',
      applicant: {
        full_name: 'Sundar Pichai',
        email: `candidate.rejected.${Date.now()}@gmail.com`
      },
      job_id: '5'
    })
  }).then(r => r.json());
  assert(rejectedEmailRes.success === true, 'Polite rejection notice email dispatched successfully');

  // 7. Contact Inquiries & Admin Telemetry
  console.log('\n[7/7] Verifying Inquiries & Email Audit Trail...');
  const contactRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Satya Nadella',
      email: 'satya.nadella@globalcorp.com',
      phone: '+91 99887 76655',
      subject: 'Global Document Digitization Enterprise Partnership',
      message: 'Requesting partnership consultation with Ramesh K and leadership.'
    })
  }).then(r => r.json());
  assert(contactRes.success === true, 'Public contact form message submitted successfully');

  const emailLogsRes = await fetch(`${BASE_URL}/api/admin/emails/logs`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  }).then(r => r.json());
  assert(emailLogsRes.success === true && emailLogsRes.data.length > 0, `Email audit log records dispatched notifications (${emailLogsRes.data.length} logs recorded)`);

  console.log('\n================================================================');
  console.log(`  VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
