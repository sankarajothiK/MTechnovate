const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mtechnovate.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency
db.exec('PRAGMA journal_mode = WAL;');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      company_name TEXT NOT NULL,
      tagline TEXT,
      ceo_name TEXT NOT NULL,
      ceo_designation TEXT,
      ceo_photo TEXT,
      ceo_message TEXT,
      logo TEXT,
      address TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      whatsapp_number TEXT,
      social_linkedin TEXT,
      social_instagram TEXT,
      social_twitter TEXT,
      social_github TEXT,
      about_text TEXT,
      vision TEXT,
      mission TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      icon TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      detailed_desc TEXT,
      tech_tags TEXT,
      featured INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      employment_type TEXT NOT NULL,
      experience TEXT NOT NULL,
      salary_range TEXT,
      skills TEXT NOT NULL,
      description TEXT NOT NULL,
      responsibilities TEXT,
      requirements TEXT,
      posted_date TEXT NOT NULL,
      deadline TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER,
      job_title TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      resume_url TEXT NOT NULL,
      resume_filename TEXT NOT NULL,
      cover_letter TEXT,
      linkedin_url TEXT,
      portfolio_url TEXT,
      skills TEXT,
      additional_info TEXT,
      status TEXT DEFAULT 'New',
      interview_date TEXT,
      interview_time TEXT,
      interview_mode TEXT,
      interview_meeting_link TEXT,
      interview_notes TEXT,
      applied_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_read INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS email_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_type TEXT UNIQUE NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      html_body TEXT NOT NULL,
      template_type TEXT NOT NULL,
      status TEXT DEFAULT 'Sent',
      sent_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Ensure new columns exist in existing database tables
  try { db.exec("ALTER TABLE company_profile ADD COLUMN social_instagram TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE company_profile ADD COLUMN whatsapp_number TEXT;"); } catch (e) {}

  seedDefaultData();
}

function seedDefaultData() {
  // Check if company_profile exists
  const profile = db.prepare('SELECT id FROM company_profile WHERE id = 1').get();
  if (!profile) {
    const insertProfile = db.prepare(`
      INSERT INTO company_profile (
        id, company_name, tagline, ceo_name, ceo_designation,
        ceo_photo, ceo_message, logo, address, email, phone,
        whatsapp_number, social_linkedin, social_instagram, social_twitter, social_github,
        about_text, vision, mission, updated_at
      ) VALUES (
        1,
        'M TECHNOVATE SOLUTIONS',
        'Delivering Trusted Global Data Solutions',
        'RAMESH K',
        'Founder & Managing Director',
        '/uploads/company/ceo_ramesh_k.jpg',
        'At M TECHNOVATE SOLUTIONS, our mission is to deliver flawless, global-standard data solutions with 99%+ accuracy to international clients, while creating empowering, sustainable career opportunities for skilled youth and women professionals right here in Kadayam.',
        '/uploads/company/logo.jpg',
        'M.G.Complex, Busstand, Kadayam-627 415.',
        'mtechnovatesolutions@gmail.com',
        '+91 87783 40454',
        '8778340454',
        'https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D',
        'https://www.instagram.com/mtechnovatesolutions?stkn=MTg5dmt3cmhjMWN4Mw==',
        'https://twitter.com/mtechnovate',
        'https://github.com/m-technovate',
        'M TECHNOVATE SOLUTIONS is a premier non-IT global data technology, BPO, and document processing enterprise headquartered in Kadayam, Tamil Nadu. We specialize in high-precision data processing, USA documentation & vital records management, handwritten historical document indexing, EPUB conversion, and international back-office support for clients across USA, UK, Europe, Australia, and worldwide.',
        'To be an internationally recognized and trusted leader in global data processing, document digitization, and business support solutions, known for precision, reliability, and positive community transformation.',
        'To deliver accurate, dependable data and document services that adhere to the highest international quality standards, empowering global businesses with trusted data while uplifting local talent through meaningful professional employment.',
        datetime('now')
      )
    `);
    insertProfile.run();
  }

  // Check admin users
  const admin = db.prepare('SELECT id FROM admin_users WHERE email = ?').get('admin@mtechnovate.com');
  if (!admin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    const insertAdmin = db.prepare(`
      INSERT INTO admin_users (email, password_hash, name, role, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    insertAdmin.run('admin@mtechnovate.com', hash, 'Ramesh K (Admin)', 'superadmin');
  }

  // Check email templates
  const countTemplates = db.prepare('SELECT COUNT(*) as cnt FROM email_templates').get();
  if (countTemplates.cnt === 0) {
    const insertTemplate = db.prepare(`
      INSERT INTO email_templates (template_type, subject, body, updated_at)
      VALUES (?, ?, ?, datetime('now'))
    `);

    insertTemplate.run(
      'shortlist_interview',
      'Interview Invitation — M TECHNOVATE SOLUTIONS',
      `Dear {{applicant_name}},

We are pleased to inform you that your application for the {{job_position}} position at M TECHNOVATE SOLUTIONS has been shortlisted.

Our operations and leadership team were impressed by your profile, and we would like to invite you for an interview.

Interview Schedule Details:
------------------------------------------
Position: {{job_position}}
Date: {{interview_date}}
Time: {{interview_time}}
Mode: {{interview_mode}}
{{#if meeting_link}}Meeting Link: {{meeting_link}}{{/if}}
------------------------------------------

Location / Note:
M TECHNOVATE SOLUTIONS
M.G.Complex, Busstand, Kadayam-627 415.
Email: mtechnovatesolutions@gmail.com

Please be available 5 minutes prior to the scheduled time.

Warm regards,

RAMESH K
Founder & Managing Director
M TECHNOVATE SOLUTIONS`
    );

    insertTemplate.run(
      'rejection',
      'Application Update — M TECHNOVATE SOLUTIONS',
      `Dear {{applicant_name}},

Thank you for your interest in joining M TECHNOVATE SOLUTIONS and for applying for the {{job_position}} position.

After reviewing all applicants, we have decided to proceed with other candidates whose qualifications more closely align with our current project openings at this time.

We will keep your details on file for upcoming batches and future openings.

Warm regards,

Human Resources Team
M TECHNOVATE SOLUTIONS
M.G.Complex, Busstand, Kadayam-627 415.`
    );

    insertTemplate.run(
      'selected',
      'Offer of Selection: {{job_position}} — M TECHNOVATE SOLUTIONS',
      `Dear {{applicant_name}},

Congratulations! On behalf of the executive leadership at M TECHNOVATE SOLUTIONS, we are pleased to inform you that you have been selected for the position of {{job_position}}.

Our Human Resources and Operations team will reach out to you within 24 to 48 hours with your formal offer package, role documentation, and joining schedule.

We look forward to welcoming you to our Kadayam team!

Warm regards,

RAMESH K
Founder & Chief Executive Officer
M TECHNOVATE SOLUTIONS
M.G.Complex, Busstand, Kadayam-627 415.`
    );
  }
}

// Initialize on load
initSchema();

module.exports = db;
