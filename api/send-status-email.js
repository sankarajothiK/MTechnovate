const nodemailer = require('nodemailer');

// Google SMTP configuration with secure fallback
const SMTP_USER = process.env.SMTP_USER || 'mtechnovatesolutions@gmail.com';
const SMTP_PASS = (process.env.SMTP_PASS || 'gdnpjxqbjyodgedu').replace(/\s+/g, '');
const FROM_NAME = process.env.SMTP_FROM_NAME || 'M TECHNOVATE Recruitment';
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'mtechnovatesolutions@gmail.com';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

function generateBrandedHtml({ title, contentHtml }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center style="width: 100%; background-color: #f1f5f9; text-align: center;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; margin: 0 auto; table-layout: fixed;">
      <tr>
        <td align="center" style="padding: 32px 12px; text-align: center;">
          <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto !important; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); text-align: left;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
                <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; text-align: center;">
                  <tr>
                    <td align="center" style="text-align: center;">
                      <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 1.5px; margin: 0; text-transform: uppercase; text-align: center;">M TECHNOVATE SOLUTIONS</h1>
                      <p style="color: #38bdf8; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 0 0; text-align: center;">Talent Acquisition & Operations • Kadayam</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Body Content -->
            <tr>
              <td style="padding: 36px 32px; font-size: 15px; line-height: 1.65; color: #1e293b; background-color: #ffffff; text-align: left;">
                ${contentHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f8fafc; padding: 24px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
                <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155; text-align: center;">M TECHNOVATE SOLUTIONS PRIVATE LIMITED</p>
                <p style="margin: 0 0 4px 0; text-align: center;">M.G. Complex, New Bus Stand Road, Kadayam - 627 415, Tenkasi District, Tamil Nadu, India.</p>
                <p style="margin: 0 0 10px 0; text-align: center;">Official Recruitment Desk: <a href="mailto:mtechnovatesolutions@gmail.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">mtechnovatesolutions@gmail.com</a> | <a href="https://m-technovate.vercel.app" style="color: #2563eb; text-decoration: none; font-weight: 600;">m-technovate.vercel.app</a></p>
                <p style="margin: 0; font-size: 11px; color: #94a3b8; text-align: center;">You are receiving this official correspondence regarding your job application with M TECHNOVATE.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { status, schedule = {}, rejectionReason, applicant = {} } = body;

    const email = (applicant.email || '').trim();
    const fullName = (applicant.full_name || applicant.candidateName || 'Candidate').trim();
    const jobTitle = applicant.job_title || applicant.jobTitle || 'Applied Vacancy';

    if (!email || !status) {
      return res.status(400).json({ success: false, message: 'Applicant email and status are required' });
    }

    const normStatus = status.toLowerCase();
    let subject = '';
    let contentHtml = '';
    let text = '';

    if (normStatus === 'shortlisted' || normStatus.includes('shortlist') || normStatus.includes('interview')) {
      const interviewDate = schedule.interview_date || schedule.date || 'To be communicated';
      const interviewTime = schedule.interview_time || schedule.time || '11:00 AM IST';
      const interviewMode = schedule.interview_mode || schedule.mode || 'Online Video Conference';
      const meetingLink = schedule.interview_meeting_link || schedule.meetingLink || 'https://meet.google.com/m-technovate-interview';
      const notes = schedule.interview_notes || schedule.notes || '';

      subject = `Interview Invitation: ${jobTitle} — M TECHNOVATE SOLUTIONS`;
      contentHtml = `
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Dear ${fullName},</h2>
        
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
                  <td style="color: #64748b; font-weight: 600;">Date:</td>
                  <td style="color: #1d4ed8; font-weight: 700;">${interviewDate}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600;">Time:</td>
                  <td style="color: #1d4ed8; font-weight: 700;">${interviewTime}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600;">Format / Mode:</td>
                  <td style="color: #0f172a;">${interviewMode}</td>
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
        <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 28px auto; text-align: center;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #2563eb; text-align: center;">
              <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 600; font-size: 15px; text-align: center;">
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
          <span style="color: #64748b;">Founder & Managing Director<br />M TECHNOVATE SOLUTIONS</span>
        </div>
      `;

      text = `Dear ${fullName},\n\nCongratulations! Your application for the ${jobTitle} position at M TECHNOVATE SOLUTIONS has been shortlisted for an interview.\n\nDate: ${interviewDate}\nTime: ${interviewTime}\nFormat: ${interviewMode}\nMeeting Link: ${meetingLink}\n\nWarm regards,\nRAMESH K\nM TECHNOVATE SOLUTIONS`;

    } else if (normStatus === 'selected') {
      const joiningDate = schedule.joining_date || schedule.date || 'To be communicated during onboarding';
      const reportingTime = schedule.reporting_time || schedule.time || '09:30 AM IST';
      const joiningLocation = schedule.joining_location || schedule.location || 'M TECHNOVATE Corporate HQ, M.G. Complex, Kadayam';
      const notes = schedule.onboarding_notes || schedule.notes || 'Please carry original academic credentials, government photo ID (Aadhar/PAN), and 2 passport photos.';

      subject = `Offer of Selection: ${jobTitle} — M TECHNOVATE SOLUTIONS`;
      contentHtml = `
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Congratulations, ${fullName}!</h2>
        
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
          On behalf of the leadership team at <strong>M TECHNOVATE SOLUTIONS</strong>, we are thrilled to formally inform you that you have been 
          <strong style="color: #15803d;">selected</strong> for the position of <strong style="color: #0f172a;">${jobTitle}</strong>.
        </p>

        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0; border: 1px solid #bbf7d0; border-radius: 8px; overflow: hidden; background-color: #f0fdf4;">
          <tr>
            <td style="background-color: #dcfce7; padding: 12px 18px; font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
              Official Offer & Joining Confirmation
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 20px;">
              <table width="100%" border="0" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td width="140" style="color: #4b5563; font-weight: 600;">Selected Role:</td>
                  <td style="color: #0f172a; font-weight: 700;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="color: #4b5563; font-weight: 600;">Joining / Start Date:</td>
                  <td style="color: #15803d; font-weight: 700; font-size: 15px;">${joiningDate}</td>
                </tr>
                <tr>
                  <td style="color: #4b5563; font-weight: 600;">Reporting Time:</td>
                  <td style="color: #15803d; font-weight: 700;">${reportingTime}</td>
                </tr>
                <tr>
                  <td style="color: #4b5563; font-weight: 600;">Reporting Venue / Mode:</td>
                  <td style="color: #0f172a;">${joiningLocation}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${notes ? `
        <table width="100%" border="0" cellpadding="14" cellspacing="0" style="margin: 20px 0; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px;">
          <tr>
            <td style="font-size: 14px; color: #1e40af; line-height: 1.5;">
              <strong>Joining Instructions & Orientation:</strong><br />
              ${notes}
            </td>
          </tr>
        </table>
        ` : ''}

        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 28px auto 24px auto; text-align: center;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #16a34a; text-align: center;">
              <a href="mailto:mtechnovatesolutions@gmail.com?subject=Offer%20Acceptance%20Confirmation%20-%20${encodeURIComponent(fullName)}%20(${encodeURIComponent(jobTitle)})" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff !important; text-decoration: none; padding: 13px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; text-align: center;">
                Acknowledge & Confirm Acceptance
              </a>
            </td>
          </tr>
        </table>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; line-height: 1.5; color: #334155;">
          Warm regards,<br />
          <strong style="color: #0f172a; font-size: 15px;">RAMESH K</strong><br />
          <span style="color: #64748b;">Founder & Managing Director<br />M TECHNOVATE SOLUTIONS</span>
        </div>
      `;

      text = `Congratulations ${fullName}! On behalf of M TECHNOVATE SOLUTIONS, we are thrilled to inform you that you have been selected for the position of ${jobTitle}.\n\nJoining Date: ${joiningDate}\nReporting Time: ${reportingTime}\nReporting Venue: ${joiningLocation}\n\nWarm regards,\nRAMESH K\nM TECHNOVATE SOLUTIONS`;

    } else if (normStatus === 'rejected') {
      subject = `Application Update: ${jobTitle} — M TECHNOVATE SOLUTIONS`;
      contentHtml = `
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Dear ${fullName},</h2>
        
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
          Thank you for your interest in joining <strong>M TECHNOVATE SOLUTIONS</strong> and for taking the time to share your background for the 
          <strong style="color: #0f172a;">${jobTitle}</strong> position.
        </p>

        <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
          Our technical review board evaluated all submissions with great care. While your credentials and qualifications are commendable, we have decided to advance other candidates whose immediate experience and specialized toolsets align more closely with the current project requirements.
        </p>

        ${rejectionReason ? `
        <table width="100%" border="0" cellpadding="12" cellspacing="0" style="margin: 16px 0; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
          <tr>
            <td style="font-size: 14px; color: #991b1b; line-height: 1.5;">
              <strong>Feedback:</strong><br />
              ${rejectionReason}
            </td>
          </tr>
        </table>
        ` : ''}

        <table width="100%" border="0" cellpadding="14" cellspacing="0" style="margin: 20px 0; background-color: #f8fafc; border-left: 4px solid #94a3b8; border-radius: 4px;">
          <tr>
            <td style="font-size: 14px; color: #475569; line-height: 1.5;">
              We will keep your resume in our active talent pool. As new projects and vacancies open up, our recruitment team will reach out directly should a suitable opportunity arise.
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

      text = `Dear ${fullName},\n\nThank you for applying for the ${jobTitle} position at M TECHNOVATE SOLUTIONS. After careful evaluation, we have chosen to advance other candidates whose current profiles more closely fit our immediate needs.\n\nWe will retain your resume in our talent pool for future openings.\n\nWarm regards,\nTalent Acquisition Team\nM TECHNOVATE SOLUTIONS`;
    } else {
      return res.status(200).json({ success: true, message: `Status ${status} does not require automated candidate email.` });
    }

    const html = generateBrandedHtml({ title: subject, contentHtml });
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      replyTo: FROM_EMAIL,
      to: email,
      subject,
      html,
      text
    });

    console.log(`[SMTP Live] Dispatched ${status} email successfully to ${email}`);

    return res.status(200).json({
      success: true,
      message: `Candidate ${status} email dispatched successfully to ${email}`,
      result: {
        status: 'Delivered (SMTP)',
        recipient: email,
        subject
      }
    });
  } catch (err) {
    console.error('send-status-email serverless error:', err);
    return res.status(500).json({
      success: false,
      message: `Failed to deliver email: ${err.message}`
    });
  }
};
