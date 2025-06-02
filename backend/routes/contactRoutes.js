const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { sendEmail } = require('../utils/emailService');

// Import logger with fallback for resilience
let logger;
try {
  logger = require('../utils/logger');
} catch (error) {
  // Create a simple fallback logger if the main logger is not available
  logger = {
    info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
    warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || ''),
    error: (msg, data, err) => console.error(`[ERROR] ${msg}`, data || '', err || '')
  };
}

// Create Contact model schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread'
  }
});

// Create model if it doesn't exist already
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// POST endpoint to submit contact form
router.post('/', [
  // Validate input
  check('name').trim().notEmpty().withMessage('Name is required'),
  check('email').trim().isEmail().withMessage('Valid email is required'),
  check('subject').trim().notEmpty().withMessage('Subject is required'),
  check('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Create new contact message
    const { name, email, subject, message } = req.body;
    const contactMessage = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save message to database
    await contactMessage.save();

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'your-email@example.com'; // Update with your email
    const emailResult = await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    if (!emailResult.success) {
      logger.warn('Failed to send contact form notification email', { error: emailResult.message });
      // We still return success as the message was saved to the database
    }

    // Send confirmation email to the user
    const userEmailResult = await sendEmail({
      to: email,
      subject: 'Thank you for contacting NovelistanAI',
      text: `Dear ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nYour message:\n${message}\n\nBest regards,\nThe NovelistanAI Team`,
      html: `
        <h2>Thank you for contacting NovelistanAI</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        <h3>Your message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>The NovelistanAI Team</p>
      `
    });

    if (!userEmailResult.success) {
      logger.warn('Failed to send confirmation email to user', { error: userEmailResult.message });
    }

    // Send success response
    res.status(201).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET endpoint to retrieve all contact messages (Admin only)
// This would typically be protected by authentication middleware
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// PATCH endpoint to update message status (Admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['unread', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedMessage = await Contact.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
