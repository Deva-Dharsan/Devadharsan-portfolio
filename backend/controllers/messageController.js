import Message from '../models/Message.js';

// Send email notification to portfolio owner via Web3Forms
const sendEmailNotification = async ({ name, email, subject, message }) => {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.warn('WEB3FORMS_ACCESS_KEY is not set. Email notification skipped.');
    return;
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        subject: `📬 Portfolio Message: ${subject}`,
        message: message,
        from_name: 'Portfolio Contact'
      })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Web3Forms Error:', result.message || result);
    }
  } catch (err) {
    console.error('Web3Forms Request Failed:', err.message);
  }
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

    // Send email notification (non-blocking)
    sendEmailNotification({ name, email, subject, message });

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
