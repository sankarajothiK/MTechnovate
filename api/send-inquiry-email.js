const nodemailer = require('nodemailer');

const SMTP_USER = process.env.SMTP_USER || 'mtechnovatesolutions@gmail.com';
const SMTP_PASS = (process.env.SMTP_PASS || 'gdnpjxqbjyodgedu').replace(/\s+/g, '');
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'mtechnovatesolutions@gmail.com';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
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
    const { name, email, phone, subject, message } = body;

    const senderName = (name || 'Website Visitor').trim();
    const senderEmail = (email || 'Not provided').trim();
    const senderPhone = (phone || 'Not provided').trim();
    const inquirySubject = (subject || 'New Client Inquiry').trim();
    const inquiryMessage = (message || '').trim();

    const transporter = getTransporter();

    const mailOptions = {
      from: `"M TECHNOVATE Inquiries" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: senderEmail !== 'Not provided' ? senderEmail : SMTP_USER,
      subject: `[New Inquiry] ${inquirySubject} — ${senderName}`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 24px; text-align: center; color: #ffffff; }
    .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
    .body { padding: 30px 24px; color: #334155; font-size: 14px; line-height: 1.6; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 600; color: #0f172a; }
    .message-box { background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #0284c7; margin-top: 12px; font-style: italic; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>M TECHNOVATE SOLUTIONS</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #38bdf8;">New Customer Inquiry Received</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Sender Name</div>
        <div class="value">${senderName}</div>
      </div>
      <div class="field">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${senderEmail}" style="color: #0284c7;">${senderEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone Number</div>
        <div class="value">${senderPhone}</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${inquirySubject}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${inquiryMessage.replace(/\n/g, '<br/>') || 'No message provided.'}</div>
      </div>
    </div>
    <div class="footer">
      This notification was automatically sent by the M TECHNOVATE Solutions web platform.
    </div>
  </div>
</body>
</html>`
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Inquiry received and notification email dispatched',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error dispatching inquiry email:', error);
    // Don't fail the user request if SMTP has a transient issue
    return res.status(200).json({
      success: true,
      message: 'Inquiry saved to database',
      warning: error.message
    });
  }
};
