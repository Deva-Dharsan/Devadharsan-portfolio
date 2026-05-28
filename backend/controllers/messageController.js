import Message from '../models/Message.js';

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
