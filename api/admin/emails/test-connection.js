const nodemailer = require('nodemailer');

const SMTP_USER = process.env.SMTP_USER || 'mtechnovatesolutions@gmail.com';
const SMTP_PASS = (process.env.SMTP_PASS || 'gdnpjxqbjyodgedu').replace(/\s+/g, '');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    await transporter.verify();
    return res.status(200).json({
      success: true,
      message: 'Google SMTP connection verified successfully! Candidate interview invitations and status emails are dispatching live from mtechnovatesolutions@gmail.com.'
    });
  } catch (err) {
    console.error('SMTP test error:', err);
    return res.status(500).json({
      success: false,
      message: `SMTP verification failed: ${err.message}`
    });
  }
};
