import Experience from '../models/Experience.js';

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an experience
// @route   POST /api/experiences
// @access  Private/Admin
export const createExperience = async (req, res) => {
  const { role, company, duration, description, skills, order } = req.body;

  try {
    const experience = new Experience({
      role,
      company,
      duration,
      description,
      skills,
      order: order || 0,
    });

    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Private/Admin
export const updateExperience = async (req, res) => {
  const { role, company, duration, description, skills, order } = req.body;

  try {
    const experience = await Experience.findById(req.params.id);

    if (experience) {
      experience.role = role || experience.role;
      experience.company = company || experience.company;
      experience.duration = duration || experience.duration;
      experience.description = description || experience.description;
      experience.skills = skills || experience.skills;
      experience.order = order !== undefined ? order : experience.order;

      const updatedExperience = await experience.save();
      res.json(updatedExperience);
    } else {
      res.status(404).json({ message: 'Experience entry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (experience) {
      await experience.deleteOne();
      res.json({ message: 'Experience entry removed' });
    } else {
      res.status(404).json({ message: 'Experience entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
