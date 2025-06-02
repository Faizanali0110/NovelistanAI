const nodemailer = require('nodemailer');
const logger = require('./logger');

// Fallback logging in case logger module fails
const fallbackLog = (level, message, data) => {
  console[level](`[${new Date().toISOString()}] ${message}`, data);
};

// Configure email transport
const createTransporter = async () => {
  // For production, use environment variables
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  try {
    // Create reusable transporter object
    const transporter = nodemailer.createTransport(emailConfig);
    
    // Verify connection configuration
    await transporter.verify();
    try {
      logger.info('Email service connected successfully');
    } catch (err) {
      fallbackLog('log', 'Email service connected successfully');
    }
    return transporter;
  } catch (error) {
    try {
      logger.error('Email service connection failed', { error: error.message });
    } catch (err) {
      fallbackLog('error', 'Email service connection failed', { error: error.message });
    }
    return null;
  }
};

// Send email function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = await createTransporter();
    
    if (!transporter) {
      try {
        logger.error('Failed to create email transporter');
      } catch (err) {
        fallbackLog('error', 'Failed to create email transporter');
      }
      return { success: false, message: 'Email service unavailable' };
    }

    // Default sender email
    const from = process.env.EMAIL_FROM || 'noreply@novelistanai.com';
    
    // Send mail
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    try {
      logger.info('Email sent successfully', { messageId: info.messageId });
    } catch (err) {
      fallbackLog('log', 'Email sent successfully', { messageId: info.messageId });
    }
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    try {
      logger.error('Failed to send email', { error: error.message });
    } catch (err) {
      fallbackLog('error', 'Failed to send email', { error: error.message });
    }
    return { 
      success: false, 
      message: error.message 
    };
  }
};

module.exports = {
  sendEmail
};
