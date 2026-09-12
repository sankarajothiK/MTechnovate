const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const { sendShortlistEmail, sendRejectionEmail, sendSelectionEmail, verifyConnection } = require('../services/mailer');

// Storage for Gallery uploads
const galleryDir = path.join(__dirname, '..', '..', 'uploads', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, galleryDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitized = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `gallery_${sanitized}_${Date.now()}${ext}`);
  }
});

const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files (.jpg, .jpeg, .png, .webp, .svg) are allowed.'));
  }
});

// Storage for Company uploads (Logo / CEO photo)
const companyDir = path.join(__dirname, '..', '..', 'uploads', 'company');
if (!fs.existsSync(companyDir)) {
  fs.mkdirSync(companyDir, { recursive: true });
}

const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, companyDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitized = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `company_${sanitized}_${Date.now()}${ext}`);
  }
});

const uploadCompany = multer({
  storage: companyStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ==========================================
// AUTHENTICATION
// ==========================================

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email.trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/me
router.get('/me', requireAuth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, role, created_at FROM admin_users WHERE id = ?').get(req.admin.id);
    if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, admin: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// DASHBOARD STATS
// ==========================================

router.get('/dashboard', requireAuth, (req, res) => {
  try {
    const totalApps = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
    const newApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'New'").get().count;
    const underReviewApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Under Review'").get().count;
    const shortlistedApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Shortlisted'").get().count;
    const selectedApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Selected'").get().count;
    const rejectedApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Rejected'").get().count;

    const activeJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1').get().count;
    const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
    const totalGallery = db.prepare('SELECT COUNT(*) as count FROM gallery').get().count;
    const totalServices = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
    const unreadMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').get().count;

    // Recent applications
    const recentApps = db.prepare(`
      SELECT id, job_title, full_name, email, phone, status, applied_at
      FROM applications ORDER BY id DESC LIMIT 5
    `).all();

    // Recent jobs
    const recentJobs = db.prepare(`
      SELECT id, title, department, location, employment_type, is_active, posted_date
      FROM jobs ORDER BY id DESC LIMIT 5
    `).all();

    // Applications by Job breakdown
    const appsByJob = db.prepare(`
      SELECT job_title, COUNT(*) as count 
      FROM applications 
      GROUP BY job_title 
      ORDER BY count DESC LIMIT 6
    `).all();

    res.json({
      success: true,
      stats: {
        totalApplications: totalApps,
        newApplications: newApps,
        underReviewApplications: underReviewApps,
        shortlistedApplications: shortlistedApps,
        selectedApplications: selectedApps,
        rejectedApplications: rejectedApps,
        activeJobs,
        totalJobs,
        totalGallery,
        totalServices,
        unreadMessages
      },
      statusDistribution: [
        { name: 'New', count: newApps, color: '#3B82F6' },
        { name: 'Under Review', count: underReviewApps, color: '#F59E0B' },
        { name: 'Shortlisted', count: shortlistedApps, color: '#10B981' },
        { name: 'Selected', count: selectedApps, color: '#8B5CF6' },
        { name: 'Rejected', count: rejectedApps, color: '#EF4444' }
      ],
      appsByJob,
      recentApplications: recentApps,
      recentJobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// ATS / APPLICATION MANAGEMENT
// ==========================================

// GET /api/admin/applications (filter, search, sort)
router.get('/applications', requireAuth, (req, res) => {
  try {
    const { status, job_id, search, sort = 'desc' } = req.query;
    let query = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (job_id && job_id !== 'All') {
      query += ' AND job_id = ?';
      params.push(job_id);
    }

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR job_title LIKE ? OR skills LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    query += ` ORDER BY id ${sort.toLowerCase() === 'asc' ? 'ASC' : 'DESC'}`;

    const apps = db.prepare(query).all(...params);
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/applications/:id
router.get('/applications/:id', requireAuth, (req, res) => {
  try {
    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/applications/:id/status
// Handles Shortlist scheduling + automated emails, or Rejection + optional rejection email
router.put('/applications/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      interview_date,
      interview_time,
      interview_mode,
      interview_meeting_link,
      interview_notes,
      send_rejection_email
    } = req.body;

    let applicant = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    if (!applicant && req.body.email) {
      applicant = db.prepare('SELECT * FROM applications WHERE LOWER(email) = LOWER(?) ORDER BY id DESC LIMIT 1').get(req.body.email.trim());
    }
    if (!applicant && req.body.applicant?.email) {
      applicant = db.prepare('SELECT * FROM applications WHERE LOWER(email) = LOWER(?) ORDER BY id DESC LIMIT 1').get(req.body.applicant.email.trim());
    }
    if (!applicant) {
      // Create synthetic applicant object if only in Firestore
      applicant = {
        id,
        full_name: req.body.full_name || req.body.applicant?.full_name || 'Candidate',
        email: req.body.email || req.body.applicant?.email,
        job_id: req.body.job_id || 1,
        job_title: req.body.job_title || 'Applied Position'
      };
    }

    const targetDbId = typeof applicant.id === 'number' ? applicant.id : null;

    const job = (applicant.job_id ? db.prepare('SELECT * FROM jobs WHERE id = ?').get(applicant.job_id) : null) || {
      title: applicant.job_title || req.body.job_title || 'Selected Role',
      department: 'Engineering & Operations'
    };

    let emailResult = null;

    if (status === 'Shortlisted') {
      // Validate scheduling requirements
      if (!interview_date || !interview_time) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both an Interview Date and Interview Time when shortlisting a candidate.'
        });
      }

      // Update DB with interview details if present in SQLite
      if (targetDbId) {
        const updateStmt = db.prepare(`
          UPDATE applications SET 
            status = 'Shortlisted',
            interview_date = ?,
            interview_time = ?,
            interview_mode = ?,
            interview_meeting_link = ?,
            interview_notes = ?,
            updated_at = datetime('now')
          WHERE id = ?
        `);

        updateStmt.run(
          interview_date,
          interview_time,
          interview_mode || 'Online',
          interview_meeting_link || '',
          interview_notes || '',
          targetDbId
        );
      }

      // Trigger automated shortlist invitation email
      emailResult = await sendShortlistEmail({
        applicant,
        job,
        schedule: {
          date: interview_date,
          time: interview_time,
          mode: interview_mode || 'Online',
          meetingLink: interview_meeting_link,
          notes: interview_notes
        }
      });
    } else if (status === 'Rejected') {
      if (targetDbId) {
        const updateStmt = db.prepare(`
          UPDATE applications SET 
            status = 'Rejected',
            updated_at = datetime('now')
          WHERE id = ?
        `);
        updateStmt.run(targetDbId);
      }

      if (send_rejection_email) {
        emailResult = await sendRejectionEmail({ applicant, job });
      }
    } else if (status === 'Selected') {
      const joining_date = req.body.joining_date || req.body.date || req.body.schedule?.joining_date || req.body.schedule?.date;
      const reporting_time = req.body.reporting_time || req.body.time || req.body.schedule?.reporting_time || req.body.schedule?.time;
      const joining_location = req.body.joining_location || req.body.mode || req.body.schedule?.joining_location || req.body.schedule?.mode;
      const onboarding_notes = req.body.onboarding_notes || req.body.notes || req.body.schedule?.notes;

      if (targetDbId) {
        const updateStmt = db.prepare(`
          UPDATE applications SET 
            status = 'Selected',
            updated_at = datetime('now')
          WHERE id = ?
        `);
        updateStmt.run(targetDbId);
      }

      const send_selection_email = req.body.send_selection_email !== false;
      if (send_selection_email) {
        emailResult = await sendSelectionEmail({ 
          applicant, 
          job,
          schedule: {
            joining_date,
            reporting_time,
            joining_location,
            notes: onboarding_notes
          }
        });
      }
    } else {
      // 'New' or 'Under Review'
      if (targetDbId) {
        const updateStmt = db.prepare(`
          UPDATE applications SET 
            status = ?,
            updated_at = datetime('now')
          WHERE id = ?
        `);
        updateStmt.run(status, targetDbId);
      }
    }

    const updatedApplicant = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);

    res.json({
      success: true,
      message: `Status updated to "${status}" successfully.${emailResult ? ' Email notification processed.' : ''}`,
      data: updatedApplicant,
      emailResult
    });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/applications/:id
router.delete('/applications/:id', requireAuth, (req, res) => {
  try {
    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    // Remove file if exists
    if (app.resume_url) {
      const filePath = path.join(__dirname, '..', '..', app.resume_url);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Application removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// JOB MANAGEMENT
// ==========================================

// GET /api/admin/jobs
router.get('/jobs', requireAuth, (req, res) => {
  try {
    const jobs = db.prepare('SELECT * FROM jobs ORDER BY id DESC').all();
    const parsed = jobs.map(j => {
      let resp = [];
      let reqs = [];
      try { resp = JSON.parse(j.responsibilities || '[]'); } catch (e) { resp = []; }
      try { reqs = JSON.parse(j.requirements || '[]'); } catch (e) { reqs = []; }
      return { ...j, responsibilities: resp, requirements: reqs };
    });
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/jobs
router.post('/jobs', requireAuth, (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employment_type,
      experience,
      salary_range,
      skills,
      description,
      responsibilities,
      requirements,
      deadline,
      is_active
    } = req.body;

    if (!title || !department || !location || !employment_type || !description) {
      return res.status(400).json({ success: false, message: 'Title, department, location, employment type and description are required.' });
    }

    const respStr = Array.isArray(responsibilities) ? JSON.stringify(responsibilities) : (responsibilities || '[]');
    const reqStr = Array.isArray(requirements) ? JSON.stringify(requirements) : (requirements || '[]');

    const insert = db.prepare(`
      INSERT INTO jobs (
        title, department, location, employment_type, experience,
        salary_range, skills, description, responsibilities, requirements,
        posted_date, deadline, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'), ?, ?)
    `);

    const result = insert.run(
      title,
      department,
      location,
      employment_type,
      experience || 'Not specified',
      salary_range || '',
      skills || '',
      description,
      respStr,
      reqStr,
      deadline || '',
      is_active ? 1 : 0
    );

    res.status(201).json({ success: true, message: 'Job created successfully', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/jobs/:id
router.put('/jobs/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      department,
      location,
      employment_type,
      experience,
      salary_range,
      skills,
      description,
      responsibilities,
      requirements,
      deadline,
      is_active
    } = req.body;

    const respStr = Array.isArray(responsibilities) ? JSON.stringify(responsibilities) : (responsibilities || '[]');
    const reqStr = Array.isArray(requirements) ? JSON.stringify(requirements) : (requirements || '[]');

    const update = db.prepare(`
      UPDATE jobs SET
        title = ?, department = ?, location = ?, employment_type = ?, experience = ?,
        salary_range = ?, skills = ?, description = ?, responsibilities = ?, requirements = ?,
        deadline = ?, is_active = ?
      WHERE id = ?
    `);

    update.run(
      title, department, location, employment_type, experience,
      salary_range, skills, description, respStr, reqStr,
      deadline, is_active ? 1 : 0, id
    );

    res.json({ success: true, message: 'Job updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/jobs/:id/toggle
router.patch('/jobs/:id/toggle', requireAuth, (req, res) => {
  try {
    const job = db.prepare('SELECT is_active FROM jobs WHERE id = ?').get(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const nextState = job.is_active ? 0 : 1;
    db.prepare('UPDATE jobs SET is_active = ? WHERE id = ?').run(nextState, req.params.id);
    res.json({ success: true, is_active: nextState, message: nextState ? 'Job published' : 'Job unpublished' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// SERVICES MANAGEMENT
// ==========================================

// GET /api/admin/services
router.get('/services', requireAuth, (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC').all();
    const parsed = services.map(s => {
      let tags = [];
      try { tags = JSON.parse(s.tech_tags || '[]'); } catch (e) { tags = []; }
      return { ...s, tech_tags: tags };
    });
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/services
router.post('/services', requireAuth, (req, res) => {
  try {
    const { title, slug, icon, short_desc, detailed_desc, tech_tags, featured, display_order } = req.body;
    if (!title || !short_desc) {
      return res.status(400).json({ success: false, message: 'Title and short description are required' });
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tagsStr = Array.isArray(tech_tags) ? JSON.stringify(tech_tags) : (tech_tags || '[]');

    const insert = db.prepare(`
      INSERT INTO services (title, slug, icon, short_desc, detailed_desc, tech_tags, featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      finalSlug,
      icon || 'Cpu',
      short_desc,
      detailed_desc || '',
      tagsStr,
      featured ? 1 : 0,
      display_order || 0
    );

    res.status(201).json({ success: true, message: 'Service created successfully', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/services/:id
router.put('/services/:id', requireAuth, (req, res) => {
  try {
    const { title, slug, icon, short_desc, detailed_desc, tech_tags, featured, display_order } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tagsStr = Array.isArray(tech_tags) ? JSON.stringify(tech_tags) : (tech_tags || '[]');

    const update = db.prepare(`
      UPDATE services SET
        title = ?, slug = ?, icon = ?, short_desc = ?, detailed_desc = ?, tech_tags = ?, featured = ?, display_order = ?
      WHERE id = ?
    `);

    update.run(
      title,
      finalSlug,
      icon || 'Cpu',
      short_desc,
      detailed_desc || '',
      tagsStr,
      featured ? 1 : 0,
      display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/services/:id
router.delete('/services/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Service removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// GALLERY MANAGEMENT
// ==========================================

// POST /api/admin/gallery (supports single or multiple image uploads)
router.post('/gallery', requireAuth, uploadGallery.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please choose at least one image to upload.' });
    }

    const { title, category, description } = req.body;
    const insert = db.prepare(`
      INSERT INTO gallery (title, category, image_url, description, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    const inserted = [];
    for (const file of req.files) {
      const imgUrl = `/uploads/gallery/${file.filename}`;
      const itemTitle = title || path.parse(file.originalname).name.replace(/[_-]/g, ' ');
      const resRow = insert.run(itemTitle, category || 'Innovation', imgUrl, description || '');
      inserted.push({ id: resRow.lastInsertRowid, title: itemTitle, image_url: imgUrl });
    }

    res.status(201).json({
      success: true,
      message: `${inserted.length} image(s) uploaded successfully!`,
      data: inserted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', requireAuth, (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    // Remove file if inside uploads/gallery
    if (item.image_url && item.image_url.startsWith('/uploads/gallery/')) {
      const filePath = path.join(__dirname, '..', '..', item.image_url);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// COMPANY PROFILE MANAGEMENT
// ==========================================

// GET /api/admin/company
router.get('/company', requireAuth, (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM company_profile WHERE id = 1').get();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/company
router.put('/company', requireAuth, uploadCompany.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'ceo_photo', maxCount: 1 }
]), (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM company_profile WHERE id = 1').get();
    const {
      company_name,
      tagline,
      ceo_name,
      ceo_designation,
      ceo_message,
      address,
      email,
      phone,
      whatsapp_number,
      social_linkedin,
      social_instagram,
      social_twitter,
      social_github,
      about_text,
      vision,
      mission
    } = req.body;

    let logoUrl = current.logo;
    let ceoPhotoUrl = current.ceo_photo;

    if (req.files && req.files['logo'] && req.files['logo'][0]) {
      logoUrl = `/uploads/company/${req.files['logo'][0].filename}`;
    }
    if (req.files && req.files['ceo_photo'] && req.files['ceo_photo'][0]) {
      ceoPhotoUrl = `/uploads/company/${req.files['ceo_photo'][0].filename}`;
    }

    const update = db.prepare(`
      UPDATE company_profile SET
        company_name = ?,
        tagline = ?,
        ceo_name = ?,
        ceo_designation = ?,
        ceo_photo = ?,
        ceo_message = ?,
        logo = ?,
        address = ?,
        email = ?,
        phone = ?,
        whatsapp_number = ?,
        social_linkedin = ?,
        social_instagram = ?,
        social_twitter = ?,
        social_github = ?,
        about_text = ?,
        vision = ?,
        mission = ?,
        updated_at = datetime('now')
      WHERE id = 1
    `);

    update.run(
      company_name !== undefined ? company_name : current.company_name,
      tagline !== undefined ? tagline : current.tagline,
      ceo_name !== undefined ? ceo_name : current.ceo_name,
      ceo_designation !== undefined ? ceo_designation : current.ceo_designation,
      ceoPhotoUrl,
      ceo_message !== undefined ? ceo_message : current.ceo_message,
      logoUrl,
      address !== undefined ? address : current.address,
      email !== undefined ? email : current.email,
      phone !== undefined ? phone : current.phone,
      whatsapp_number !== undefined ? whatsapp_number : current.whatsapp_number,
      social_linkedin !== undefined ? social_linkedin : current.social_linkedin,
      social_instagram !== undefined ? social_instagram : current.social_instagram,
      social_twitter !== undefined ? social_twitter : current.social_twitter,
      social_github !== undefined ? social_github : current.social_github,
      about_text !== undefined ? about_text : current.about_text,
      vision !== undefined ? vision : current.vision,
      mission !== undefined ? mission : current.mission
    );

    const updated = db.prepare('SELECT * FROM company_profile WHERE id = 1').get();
    res.json({ success: true, message: 'Company profile updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// EMAIL TEMPLATES & LOGS
// ==========================================

// GET /api/admin/emails/templates
router.get('/emails/templates', requireAuth, (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM email_templates').all();
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/emails/templates/:id
router.put('/emails/templates/:id', requireAuth, (req, res) => {
  try {
    const { subject, body } = req.body;
    db.prepare(`
      UPDATE email_templates SET subject = ?, body = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(subject, body, req.params.id);
    res.json({ success: true, message: 'Template updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/emails/logs
router.get('/emails/logs', requireAuth, (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM email_logs ORDER BY id DESC LIMIT 50').all();
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/emails/test-connection
router.post('/emails/test-connection', requireAuth, async (req, res) => {
  try {
    const result = await verifyConnection();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// CONTACT INQUIRIES
// ==========================================

// GET /api/admin/contact-messages
router.get('/contact-messages', requireAuth, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC').all();
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/contact-messages/:id/read
router.patch('/contact-messages/:id/read', requireAuth, (req, res) => {
  try {
    db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Message marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/contact-messages/:id
router.delete('/contact-messages/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Message removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
