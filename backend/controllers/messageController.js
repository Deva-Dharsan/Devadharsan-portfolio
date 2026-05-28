import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP (forced IPv4 for Render free tier)
const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    family: 4,    // Force IPv4 — Render free tier doesn't support IPv6
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Send email notification to portfolio owner
const sendEmailNotification = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `📬 New Message: ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0ea5e9, #8b5cf6); padding: 32px 40px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
            📬 New Contact Message
          </h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
            Someone reached out via your portfolio
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 40px;">
          <!-- Sender Info -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 13px; width: 110px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 600; color: #f1f5f9;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 13px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #94a3b8; font-size: 13px;">Subject</td>
              <td style="padding: 12px 0; font-weight: 600; color: #f1f5f9;">${subject}</td>
            </tr>
          </table>

          <!-- Message -->
          <div style="margin-bottom: 28px;">
            <p style="margin: 0 0 12px; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-left: 3px solid #0ea5e9; border-radius: 8px; padding: 18px 20px; line-height: 1.7; color: #cbd5e1; font-size: 15px; white-space: pre-wrap;">
              ${message}
            </div>
          </div>

          <!-- Reply CTA -->
          <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            ↩ Reply to ${name}
          </a>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
          <p style="margin: 0; color: #475569; font-size: 12px;">
            This message was sent from your portfolio contact form • 
            <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">View in Admin Dashboard</a>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// @desc    Send a new message (contact form submission)
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Basic validations
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All contact fields are required' });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    const createdMessage = await newMessage.save();

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendEmailNotification({ name, email, subject, message }).catch((err) => {
      console.error('Email notification failed:', err.message);
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', data: createdMessage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
export const markMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      message.status = 'read';
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await message.deleteOne();
      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
