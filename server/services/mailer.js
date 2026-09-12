const nodemailer = require('nodemailer');
const db = require('../db');

// Create reusable transporter if SMTP credentials are provided
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS || '';
  const pass = rawPass.replace(/\s+/g, '');

  if (user && pass) {
    if (host.includes('gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
}

function getSenderInfo() {
  const cleanName = (process.env.SMTP_FROM_NAME || 'M TECHNOVATE Recruitment')
    .replace(/^["']+|["']+$/g, '')
    .trim();
  const cleanEmail = (process.env.SMTP_FROM_EMAIL || 'mtechnovatesolutions@gmail.com').trim();
  return {
    from: `"${cleanName}" <${cleanEmail}>`,
    replyTo: cleanEmail,
    email: cleanEmail,
    name: cleanName
  };
}

const DELIVERABILITY_HEADERS = {
  'X-Mailer': 'M TECHNOVATE ATS System',
  'X-Auto-Response-Suppress': 'OOF, AutoReply',
  'Auto-Submitted': 'auto-generated'
};

async function verifyConnection() {
  const transporter = getTransporter();
  if (!transporter) {
    return { success: false, message: 'SMTP credentials (user or password) not configured in server/.env' };
  }
  try {
    await transporter.verify();
    return { success: true, message: 'Google SMTP connection verified successfully! Candidate interview invitations and status emails will be dispatched live from mtechnovatesolutions@gmail.com.' };
  } catch (err) {
    return { success: false, message: `SMTP connection failed: ${err.message}` };
  }
}

// Generate deliverability-optimized HTML template for emails
function generateBrandedHtml({ title, contentHtml }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 30px; text-align: center;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 1px; margin: 0; text-transform: uppercase;">M TECHNOVATE SOLUTIONS</h1>
                    <p style="color: #94a3b8; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 6px 0 0 0;">Talent Acquisition & Operations • Kadayam</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 36px 32px; font-size: 15px; line-height: 1.65; color: #1e293b; background-color: #ffffff;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #334155;">M TECHNOVATE SOLUTIONS PRIVATE LIMITED</p>
              <p style="margin: 0 0 4px 0;">M.G. Complex, New Bus Stand Road, Kadayam - 627 415, Tenkasi District, Tamil Nadu, India.</p>
              <p style="margin: 0 0 12px 0;">Official Recruitment Desk: <a href="mailto:mtechnovatesolutions@gmail.com" style="color: #2563eb; text-decoration: none;">mtechnovatesolutions@gmail.com</a> | <a href="https://mtechnovate.com" style="color: #2563eb; text-decoration: none;">mtechnovate.com</a></p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">You are receiving this official correspondence regarding your job application. If you have inquiries or need assistance, reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendShortlistEmail({ applicant, job, schedule }) {
  const { full_name, email } = applicant;
  const { date, time, mode, meetingLink, notes } = schedule;

  const jobTitle = job ? job.title : 'Selected Role';
  const jobDept = job ? job.department : 'Operations';
  const subject = `Interview Invitation: ${jobTitle} — M TECHNOVATE SOLUTIONS`;

  const contentHtml = `
    <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Dear ${full_name},</h2>
    
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
      We are pleased to inform you that following the review of your credentials, your application for the 
      <strong style="color: #0f172a;">${jobTitle}</strong> position has been shortlisted for the technical interview stage.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155;">
      Our leadership and evaluation committee were impressed by your background, and we would like to invite you to discuss your experience and project capabilities.
    </p>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background-color: #f8fafc;">
      <tr>
        <td style="background-color: #e2e8f0; padding: 10px 16px; font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
          Interview Schedule Confirmation
        </td>
      </tr>
      <tr>
        <td style="padding: 16px;">
          <table width="100%" border="0" cellpadding="6" cellspacing="0" style="font-size: 14px;">
            <tr>
              <td width="130" style="color: #64748b; font-weight: 600;">Position:</td>
              <td style="color: #0f172a; font-weight: 600;">${jobTitle}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Department:</td>
              <td style="color: #0f172a;">${jobDept}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Date:</td>
              <td style="color: #1d4ed8; font-weight: 700;">${date}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Time:</td>
              <td style="color: #1d4ed8; font-weight: 700;">${time}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600;">Format / Mode:</td>
              <td style="color: #0f172a;">${mode || 'Online Video Conference'}</td>
            </tr>
            ${meetingLink ? `
            <tr>
              <td style="color: #64748b; font-weight: 600;">Meeting Link:</td>
              <td><a href="${meetingLink}" target="_blank" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${meetingLink}</a></td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    ${meetingLink ? `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0 28px 0;">
      <tr>
        <td align="center">
          <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 13px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Join Interview Meeting
          </a>
        </td>
      </tr>
    </table>
    ` : ''}

    ${notes ? `
    <table width="100%" border="0" cellpadding="12" cellspacing="0" style="margin: 20px 0; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
      <tr>
        <td style="font-size: 14px; color: #1e40af; line-height: 1.5;">
          <strong>Preparation Notes:</strong><br />
          ${notes}
        </td>
      </tr>
    </table>
    ` : ''}

    <p style="margin: 20px 0; font-size: 14px; color: #475569;">
      Please ensure you join 5 minutes prior to the scheduled time with a stable internet connection. If you have an urgent scheduling conflict, kindly reply directly to this email at <a href="mailto:mtechnovatesolutions@gmail.com" style="color: #2563eb;">mtechnovatesolutions@gmail.com</a>.
    </p>

    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; line-height: 1.5; color: #334155;">
      Warm regards,<br />
      <strong style="color: #0f172a; font-size: 15px;">RAMESH K</strong><br />
      <span style="color: #64748b;">Founder & Chief Executive Officer<br />M TECHNOVATE SOLUTIONS</span>
    </div>
  `;

  const html = generateBrandedHtml({
    title: subject,
    contentHtml
  });

  const text = `Dear ${full_name},

Congratulations! We are pleased to inform you that your application for the ${jobTitle} position at M TECHNOVATE SOLUTIONS has been shortlisted for an interview.

INTERVIEW SCHEDULE CONFIRMATION:
---------------------------------------------
Position: ${jobTitle}
Department: ${jobDept}
Date: ${date}
Time: ${time}
Format / Mode: ${mode || 'Online Video Conference'}
${meetingLink ? `Meeting Link: ${meetingLink}\n` : ''}---------------------------------------------

${notes ? `Preparation Notes:\n${notes}\n\n` : ''}Please be available 5 minutes prior to the scheduled time with a stable internet connection. If you have any questions or require rescheduling, please reply directly to this email at mtechnovatesolutions@gmail.com.

Warm regards,

RAMESH K
Founder & Chief Executive Officer
M TECHNOVATE SOLUTIONS
M.G. Complex, New Bus Stand Road, Kadayam - 627 415, Tenkasi District, Tamil Nadu, India.
Email: mtechnovatesolutions@gmail.com
Website: https://mtechnovate.com`;

  const sender = getSenderInfo();
  const transporter = getTransporter();
  let status = 'Simulated / Logged';

  if (transporter) {
    try {
      await transporter.sendMail({
        from: sender.from,
        replyTo: sender.replyTo,
        to: email,
        subject,
        html,
        text,
        headers: {
          ...DELIVERABILITY_HEADERS,
          'X-Entity-Ref-ID': `mt-shortlist-${Date.now()}`
        }
      });
      status = 'Delivered (SMTP)';
    } catch (err) {
      console.error('SMTP Send Error (Shortlist):', err.message);
      status = `SMTP Error (${err.message})`;
    }
  }

  // Always log to email_logs in DB
  const insertLog = db.prepare(`
    INSERT INTO email_logs (recipient_email, recipient_name, subject, html_body, template_type, status, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  insertLog.run(email, full_name, subject, html, 'shortlist_interview', status);

  return { success: true, status, subject };
}

async function sendRejectionEmail({ applicant, job }) {
  const { full_name, email } = applicant;
  const jobTitle = job ? job.title : 'Applied Position';
  const subject = `Application Update: ${jobTitle} — M TECHNOVATE SOLUTIONS`;

  const contentHtml = `
    <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Dear ${full_name},</h2>
    
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
      Thank you for your interest in joining <strong>M TECHNOVATE SOLUTIONS</strong> and for taking the time to share your background for the 
      <strong style="color: #0f172a;">${jobTitle}</strong> position.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
      Our technical review board evaluated all submissions with great care. While your credentials and qualifications are commendable, we have decided to advance other candidates whose immediate experience and specialized toolsets align more closely with the current project requirements.
    </p>

    <table width="100%" border="0" cellpadding="14" cellspacing="0" style="margin: 20px 0; background-color: #f8fafc; border-left: 4px solid #94a3b8; border-radius: 4px;">
      <tr>
        <td style="font-size: 14px; color: #475569; line-height: 1.5;">
          We will keep your resume in our active talent pool. As new projects, expansions, and vacancies open up, our recruitment team will reach out directly should a suitable opportunity arise.
        </td>
      </tr>
    </table>

    <p style="margin: 20px 0; font-size: 15px; color: #334155;">
      We sincerely appreciate the time and effort you dedicated to your application and wish you the greatest success in your ongoing career endeavors.
    </p>

    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; line-height: 1.5; color: #334155;">
      Warm regards,<br />
      <strong style="color: #0f172a; font-size: 15px;">Talent Acquisition Team</strong><br />
      <span style="color: #64748b;">M TECHNOVATE SOLUTIONS<br />M.G. Complex, New Bus Stand Road, Kadayam - 627 415.</span>
    </div>
  `;

  const html = generateBrandedHtml({ title: subject, contentHtml });

  const text = `Dear ${full_name},

Thank you for your interest in joining M TECHNOVATE SOLUTIONS and for taking the time to apply for the ${jobTitle} position.

Our technical evaluation board reviewed all submissions with care. While your credentials and experience are commendable, we have decided to advance other applicants whose profiles align more closely with our immediate project requirements at this stage.

We will keep your resume on file in our talent pool for future openings that match your skills.

We sincerely appreciate your effort and wish you every success in your ongoing professional journey.

Warm regards,

Talent Acquisition Team
M TECHNOVATE SOLUTIONS
M.G. Complex, New Bus Stand Road, Kadayam - 627 415, Tenkasi District, Tamil Nadu, India.
Email: mtechnovatesolutions@gmail.com`;

  const sender = getSenderInfo();
  const transporter = getTransporter();
  let status = 'Simulated / Logged';

  if (transporter) {
    try {
      await transporter.sendMail({
        from: sender.from,
        replyTo: sender.replyTo,
        to: email,
        subject,
        html,
        text,
        headers: {
          ...DELIVERABILITY_HEADERS,
          'X-Entity-Ref-ID': `mt-rejection-${Date.now()}`
        }
      });
      status = 'Delivered (SMTP)';
    } catch (err) {
      console.error('SMTP Send Error (Rejection):', err.message);
      status = `SMTP Error (${err.message})`;
    }
  }

  const insertLog = db.prepare(`
    INSERT INTO email_logs (recipient_email, recipient_name, subject, html_body, template_type, status, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  insertLog.run(email, full_name, subject, html, 'rejection', status);

  return { success: true, status, subject };
}

async function sendSelectionEmail({ applicant, job }) {
  const { full_name, email } = applicant;
  const jobTitle = job ? job.title : 'Offered Position';
  const jobDept = job ? job.department : 'Engineering & Operations';
  const subject = `Offer of Selection: ${jobTitle} — M TECHNOVATE SOLUTIONS`;

  const contentHtml = `
    <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Congratulations, ${full_name}!</h2>
    
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
      On behalf of the leadership team at <strong>M TECHNOVATE SOLUTIONS</strong>, we are thrilled to formally inform you that you have been 
      <strong style="color: #15803d;">selected</strong> for the position of <strong style="color: #0f172a;">${jobTitle}</strong> in our ${jobDept} department.
    </p>

    <table width="100%" border="0" cellpadding="14" cellspacing="0" style="margin: 20px 0; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px;">
      <tr>
        <td style="font-size: 14px; color: #166534; line-height: 1.5;">
          <strong>Next Steps & Onboarding:</strong><br />
          Our Human Resources and Operations team will reach out to you within 24 to 48 hours with your comprehensive employment offer package, documentation checklist, and orientation schedule.
        </td>
      </tr>
    </table>

    <p style="margin: 20px 0; font-size: 15px; color: #334155;">
      We were thoroughly impressed by your performance and passion, and we look forward to building exceptional technology solutions together.
    </p>

    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; line-height: 1.5; color: #334155;">
      Warm regards,<br />
      <strong style="color: #0f172a; font-size: 15px;">RAMESH K</strong><br />
      <span style="color: #64748b;">Founder & Chief Executive Officer<br />M TECHNOVATE SOLUTIONS</span>
    </div>
  `;

  const html = generateBrandedHtml({ title: subject, contentHtml });

  const text = `Dear ${full_name},

Congratulations! On behalf of the leadership at M TECHNOVATE SOLUTIONS, we are thrilled to inform you that you have been selected for the position of ${jobTitle} in our ${jobDept} department.

Our Human Resources and Operations onboarding team will contact you within 24 to 48 hours with your formal offer package, role documentation, and joining schedule.

We look forward to welcoming you to our team!

Warm regards,

RAMESH K
Founder & Chief Executive Officer
M TECHNOVATE SOLUTIONS
M.G. Complex, New Bus Stand Road, Kadayam - 627 415, Tenkasi District, Tamil Nadu, India.
Email: mtechnovatesolutions@gmail.com
Website: https://mtechnovate.com`;

  const sender = getSenderInfo();
  const transporter = getTransporter();
  let status = 'Simulated / Logged';

  if (transporter) {
    try {
      await transporter.sendMail({
        from: sender.from,
        replyTo: sender.replyTo,
        to: email,
        subject,
        html,
        text,
        headers: {
          ...DELIVERABILITY_HEADERS,
          'X-Entity-Ref-ID': `mt-selection-${Date.now()}`
        }
      });
      status = 'Delivered (SMTP)';
    } catch (err) {
      console.error('SMTP Send Error (Selection):', err.message);
      status = `SMTP Error (${err.message})`;
    }
  }

  const insertLog = db.prepare(`
    INSERT INTO email_logs (recipient_email, recipient_name, subject, html_body, template_type, status, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  insertLog.run(email, full_name, subject, html, 'selected', status);

  return { success: true, status, subject };
}

async function sendInterviewScheduledEmail({ applicant, job, schedule }) {
  return sendShortlistEmail({ applicant, job, schedule });
}

module.exports = {
  verifyConnection,
  sendShortlistEmail,
  sendInterviewScheduledEmail,
  sendSelectionEmail,
  sendRejectionEmail
};
