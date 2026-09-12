const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('  STARTING M TECHNOVATE SYSTEM VERIFICATION SUITE');
  console.log('====================================================\n');

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

  // 1. Health Check
  const healthRes = await fetch(`${BASE_URL}/api/health`).then(r => r.json());
  assert(healthRes.status === 'healthy', 'API Health Check returns healthy status');

  // 2. Company Profile
  const companyRes = await fetch(`${BASE_URL}/api/company`).then(r => r.json());
  assert(companyRes.success === true, 'GET /api/company returns success');
  assert(companyRes.data.ceo_name === 'RAMESH K', `CEO is set to RAMESH K (got: ${companyRes.data.ceo_name})`);
  assert(companyRes.data.address.includes('Kadayam'), `Address includes Kadayam (got: ${companyRes.data.address})`);
  assert(companyRes.data.email === 'mtechnovatesolutions@gmail.com', `Email is mtechnovatesolutions@gmail.com`);
  assert(companyRes.data.company_name === 'M TECHNOVATE SOLUTIONS', `Company is M TECHNOVATE SOLUTIONS`);

  // 3. Static Uploads Serving
  const logoRes = await fetch(`${BASE_URL}/uploads/company/logo.jpg`);
  assert(logoRes.status === 200, 'Logo file is accessible at /uploads/company/logo.jpg');
  const ceoRes = await fetch(`${BASE_URL}/uploads/company/ceo_ramesh_k.jpg`);
  assert(ceoRes.status === 200, 'CEO photo is accessible at /uploads/company/ceo_ramesh_k.jpg');

  // 4. Dynamic Services
  const servicesRes = await fetch(`${BASE_URL}/api/services`).then(r => r.json());
  assert(servicesRes.success === true && servicesRes.data.length >= 6, `GET /api/services returns ${servicesRes.data?.length} services`);

  // 5. Dynamic Jobs
  const jobsRes = await fetch(`${BASE_URL}/api/jobs`).then(r => r.json());
  assert(jobsRes.success === true && jobsRes.data.length >= 4, `GET /api/jobs returns ${jobsRes.data?.length} active openings`);
  const testJob = jobsRes.data[0];

  // 6. Contact Submission
  const contactPayload = {
    name: 'Dr. Anand Kumar',
    email: 'anand.kumar@enterprise.org',
    phone: '+91 98450 11223',
    subject: 'Enterprise Cloud Transformation Project',
    message: 'We are seeking an architectural consultation with Ramesh K and the M TECHNOVATE team.'
  };
  const contactRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactPayload)
  }).then(r => r.json());
  assert(contactRes.success === true, 'POST /api/contact successfully records customer inquiry');

  // 7. Job Application Submission with Resume
  // Create a mock resume file
  const mockResumeDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(mockResumeDir)) fs.mkdirSync(mockResumeDir, { recursive: true });
  const mockResumePath = path.join(mockResumeDir, 'test_candidate_resume.pdf');
  fs.writeFileSync(mockResumePath, '%PDF-1.4 Mock Candidate Resume for M Technovate Automated Testing');

  const formData = new FormData();
  formData.append('job_id', testJob.id);
  formData.append('full_name', 'Sundar Pichai (Test Applicant)');
  const testEmail = `candidate.${Date.now()}@gmail.com`;
  formData.append('email', testEmail);
  formData.append('phone', '+91 99887 76655');
  formData.append('skills', 'React, TypeScript, Node.js, Kubernetes, Cloud Architecture');
  formData.append('cover_letter', 'Thrilled to apply for this role at M TECHNOVATE SOLUTIONS.');
  formData.append('linkedin_url', 'https://linkedin.com/in/test-applicant');
  const blob = new Blob([fs.readFileSync(mockResumePath)], { type: 'application/pdf' });
  formData.append('resume', blob, 'sundar_resume.pdf');

  const appRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    body: formData
  }).then(r => r.json());
  assert(appRes.success === true, `POST /api/applications submits application (ID: ${appRes.applicationId})`);
  const candidateAppId = appRes.applicationId;

  // 8. Admin Login
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mtechnovate.com', password: 'admin123' })
  }).then(r => r.json());
  assert(loginRes.success === true && !!loginRes.token, 'Admin authentication returns valid JWT token');
  const token = loginRes.token;

  // 9. Admin Dashboard Metrics
  const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
  assert(dashRes.success === true, 'GET /api/admin/dashboard returns telemetry');
  assert(dashRes.stats.totalApplications >= 1, `Total applicants counter tracked in ATS (count: ${dashRes.stats.totalApplications})`);

  // 10. ATS Candidate Shortlist & Interview Scheduler + Automated Email Dispatched
  const schedulePayload = {
    status: 'Shortlisted',
    interview_date: '2026-09-10',
    interview_time: '10:30 AM IST',
    interview_mode: 'Online Video Conference',
    interview_meeting_link: 'https://meet.google.com/mt-tech-interview-room',
    interview_notes: 'System architecture review and technical coding discussion.'
  };

  const shortlistRes = await fetch(`${BASE_URL}/api/admin/applications/${candidateAppId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(schedulePayload)
  }).then(r => r.json());

  assert(shortlistRes.success === true, 'ATS status changed to "Shortlisted"');
  assert(shortlistRes.data.interview_date === '2026-09-10', 'Interview date recorded in candidate schedule');
  assert(shortlistRes.data.interview_time === '10:30 AM IST', 'Interview time recorded');
  assert(shortlistRes.data.interview_meeting_link.includes('meet.google.com'), 'Interview video link recorded');

  // 11. Automated Email Audit Log
  const emailLogsRes = await fetch(`${BASE_URL}/api/admin/emails/logs`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  assert(emailLogsRes.success === true && emailLogsRes.data.length >= 1, 'Email audit logs recorded dispatched notifications');
  const latestLog = emailLogsRes.data[0];
  assert(latestLog.recipient_email === testEmail, `Dispatched notification to candidate email: ${latestLog.recipient_email}`);
  assert(latestLog.subject.includes('Interview Invitation'), `Subject line is: ${latestLog.subject}`);

  // 12. Public Website Frontend Serving
  const frontendRes = await fetch(`${BASE_URL}/`);
  assert(frontendRes.status === 200, 'Frontend SPA root page served with HTTP 200 OK');
  const html = await frontendRes.text();
  assert(html.includes('M TECHNOVATE SOLUTIONS'), 'Frontend HTML contains M TECHNOVATE SOLUTIONS branding');

  // Cleanup temp files
  try {
    fs.rmSync(mockResumeDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n====================================================');
  console.log(`  VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
