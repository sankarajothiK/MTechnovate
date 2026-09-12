const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { 
  sendShortlistEmail, 
  sendInterviewScheduledEmail, 
  sendSelectionEmail, 
  sendRejectionEmail 
} = require('../services/mailer');

// Ensure resumes directory exists
const resumesDir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Multer storage for candidate resumes
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume_${sanitizedBase}_${uniqueSuffix}${ext}`);
  }
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter: function (req, file, cb) {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx).'));
    }
  }
});

// GET /api/company
router.get('/company', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM company_profile WHERE id = 1').get();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/services
router.get('/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC').all();
    const parsed = services.map(s => {
      let tags = [];
      try {
        tags = JSON.parse(s.tech_tags || '[]');
      } catch (e) {
        tags = (s.tech_tags || '').split(',').map(t => t.trim());
      }
      return { ...s, tech_tags: tags };
    });
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/services/:id
router.get('/services/:id', (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    let tags = [];
    try { tags = JSON.parse(service.tech_tags || '[]'); } catch (e) { tags = []; }
    res.json({ success: true, data: { ...service, tech_tags: tags } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery
router.get('/gallery', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM gallery ORDER BY id DESC').all();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs
router.get('/jobs', (req, res) => {
  try {
    const jobs = db.prepare('SELECT * FROM jobs WHERE is_active = 1 ORDER BY id DESC').all();
    const parsed = jobs.map(j => {
      let resp = [];
      let reqs = [];
      try { resp = JSON.parse(j.responsibilities || '[]'); } catch (e) { resp = []; }
      try { reqs = JSON.parse(j.requirements || '[]'); } catch (e) { reqs = []; }
      return {
        ...j,
        responsibilities: resp,
        requirements: reqs,
        skills_array: (j.skills || '').split(',').map(s => s.trim())
      };
    });
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/:id
router.get('/jobs/:id', (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job vacancy not found' });
    }
    let resp = [];
    let reqs = [];
    try { resp = JSON.parse(job.responsibilities || '[]'); } catch (e) { resp = []; }
    try { reqs = JSON.parse(job.requirements || '[]'); } catch (e) { reqs = []; }
    res.json({
      success: true,
      data: {
        ...job,
        responsibilities: resp,
        requirements: reqs,
        skills_array: (job.skills || '').split(',').map(s => s.trim())
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/applications (Submit Job Application)
router.post('/applications', uploadResume.single('resume'), (req, res) => {
  try {
    const {
      job_id,
      full_name,
      email,
      phone,
      cover_letter,
      linkedin_url,
      portfolio_url,
      skills,
      additional_info
    } = req.body;

    // Validation
    if (!job_id || !full_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Job, Full Name, Email, and Phone Number.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume (.pdf, .doc, or .docx).'
      });
    }

    // Verify job exists (with fallback matching by title or first active vacancy)
    let job = db.prepare('SELECT id, title FROM jobs WHERE id = ?').get(job_id);
    if (!job && req.body.job_title) {
      job = db.prepare('SELECT id, title FROM jobs WHERE title LIKE ?').get(`%${req.body.job_title.trim()}%`);
    }
    if (!job) {
      job = db.prepare('SELECT id, title FROM jobs WHERE is_active = 1 LIMIT 1').get() || { id: 10, title: req.body.job_title || 'Applied Vacancy' };
    }

    // Duplicate check: same email and same job within 24 hours
    const existing = db.prepare(`
      SELECT id FROM applications 
      WHERE job_id = ? AND LOWER(email) = LOWER(?) AND datetime(applied_at) >= datetime('now', '-24 hours')
    `).get(job_id, email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this role in the past 24 hours. Our team is currently reviewing your submission.'
      });
    }

    const resume_url = `/uploads/resumes/${req.file.filename}`;
    const resume_filename = req.file.originalname;

    const insert = db.prepare(`
      INSERT INTO applications (
        job_id, job_title, full_name, email, phone,
        resume_url, resume_filename, cover_letter, linkedin_url, portfolio_url,
        skills, additional_info, status, applied_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', datetime('now'), datetime('now'))
    `);

    const finalLinkedin = (linkedin_url || req.body.linkedin || '').trim();

    const result = insert.run(
      job.id,
      job.title,
      full_name.trim(),
      email.trim(),
      phone.trim(),
      resume_url,
      resume_filename,
      cover_letter || '',
      finalLinkedin,
      portfolio_url || '',
      skills || '',
      additional_info || ''
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our recruitment team will review your application and contact you if your profile is shortlisted.',
      applicationId: result.lastInsertRowid,
      data: {
        id: result.lastInsertRowid,
        job_id: job.id,
        job_title: job.title,
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        resume_url,
        resume_filename,
        status: 'New'
      }
    });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/contact (Contact Enquiry)
router.post('/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email and Message are required.'
      });
    }

    const insert = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message, created_at, is_read)
      VALUES (?, ?, ?, ?, ?, datetime('now'), 0)
    `);

    insert.run(
      name.trim(),
      email.trim(),
      phone ? phone.trim() : '',
      subject ? subject.trim() : 'Website Inquiry',
      message.trim()
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to M TECHNOVATE. We have received your inquiry and our enterprise consulting team will contact you shortly.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/send-status-email
// Dispatches automated candidate status email with strict duplication prevention
router.post('/send-status-email', async (req, res) => {
  try {
    const { applicationId, status, schedule, rejectionReason, applicant, job_id } = req.body;
    if (!applicant || !applicant.email || !status) {
      return res.status(400).json({ success: false, message: 'Applicant email and status are required' });
    }

    const recipientEmail = applicant.email.trim();
    const templateTypes = [status.toLowerCase().replace(/\s+/g, '_')];
    if (status.toLowerCase().includes('shortlist')) {
      templateTypes.push('shortlist_interview');
    }
    if (status.toLowerCase().includes('interview')) {
      templateTypes.push('shortlist_interview', 'interview_scheduled');
    }
    if (status.toLowerCase().includes('reject')) {
      templateTypes.push('rejection');
    }

    // Debounce protection: prevent rapid double-clicks within 5 seconds on identical status
    const recentLog = db.prepare(`
      SELECT id FROM email_logs 
      WHERE recipient_email = ? AND template_type = ? 
      AND sent_at > datetime('now', '-5 seconds')
    `).get(recipientEmail, templateTypes[0]);

    if (recentLog && !req.body.force_send) {
      return res.json({
        success: true,
        message: 'Notification already dispatched a few seconds ago.',
        skipped: true
      });
    }

    // Retrieve job info
    let job = null;
    if (job_id) {
      job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job_id);
    }
    if (!job && applicant.job_title) {
      job = db.prepare('SELECT * FROM jobs WHERE title LIKE ?').get(`%${applicant.job_title}%`);
    }
    if (!job) {
      job = { title: applicant.job_title || 'Applied Vacancy', department: 'Operations' };
    }

    let result = { success: true };
    const norm = status.toLowerCase();

    if (norm === 'shortlisted') {
      result = await sendShortlistEmail({
        applicant,
        job,
        schedule: schedule || { date: 'To be confirmed', time: 'To be confirmed', mode: 'Video Conference' }
      });
    } else if (norm === 'interview scheduled') {
      result = await sendInterviewScheduledEmail({
        applicant,
        job,
        schedule: schedule || { date: 'To be confirmed', time: 'To be confirmed', mode: 'Video Conference' }
      });
    } else if (norm === 'selected') {
      result = await sendSelectionEmail({ 
        applicant, 
        job,
        schedule: schedule || {}
      });
    } else if (norm === 'rejected') {
      result = await sendRejectionEmail({ applicant, job });
    }

    // Also update SQLite local DB if application exists
    try {
      const matchApp = db.prepare('SELECT id FROM applications WHERE id = ? OR LOWER(email) = LOWER(?) ORDER BY id DESC LIMIT 1').get(applicationId, recipientEmail);
      if (matchApp) {
        if (norm === 'shortlisted' && schedule) {
          db.prepare(`
            UPDATE applications SET 
              status = 'Shortlisted',
              interview_date = ?,
              interview_time = ?,
              interview_mode = ?,
              interview_meeting_link = ?,
              interview_notes = ?,
              updated_at = datetime('now')
            WHERE id = ?
          `).run(schedule.date || '', schedule.time || '', schedule.mode || 'Online', schedule.meetingLink || '', schedule.notes || '', matchApp.id);
        } else if (norm === 'selected') {
          db.prepare(`
            UPDATE applications SET 
              status = 'Selected',
              updated_at = datetime('now')
            WHERE id = ?
          `).run(matchApp.id);
        } else if (norm === 'rejected') {
          db.prepare(`
            UPDATE applications SET 
              status = 'Rejected',
              updated_at = datetime('now')
            WHERE id = ?
          `).run(matchApp.id);
        }
      }
    } catch (dbSyncErr) {
      console.warn('SQLite status sync warning:', dbSyncErr.message);
    }

    res.json({
      success: true,
      message: `Status email processed for ${recipientEmail}`,
      result
    });
  } catch (err) {
    console.error('send-status-email error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
