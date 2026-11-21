import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  const {
    title,
    category,
    description,
    detailedDescription,
    tags,
    imageUrl,
    images,
    codeTag,
    githubLink,
    liveLink,
    order,
  } = req.body;

  try {
    const projectImages = Array.isArray(images)
      ? images
      : imageUrl
      ? [imageUrl]
      : [];
    const primaryImage = imageUrl || (projectImages.length > 0 ? projectImages[0] : '');

    const project = new Project({
      title,
      category: category || 'Full Stack Application',
      description,
      detailedDescription,
      tags: tags || [],
      imageUrl: primaryImage,
      images: projectImages,
      codeTag: codeTag || '',
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      order: order !== undefined ? Number(order) : 0,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  const {
    title,
    category,
    description,
    detailedDescription,
    tags,
    imageUrl,
    images,
    codeTag,
    githubLink,
    liveLink,
    order,
  } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title !== undefined ? title : project.title;
      project.category = category !== undefined ? category : project.category;
      project.description = description !== undefined ? description : project.description;
      project.detailedDescription =
        detailedDescription !== undefined ? detailedDescription : project.detailedDescription;
      project.tags = tags !== undefined ? tags : project.tags;

      if (images !== undefined) {
        project.images = Array.isArray(images) ? images : [];
        if (imageUrl !== undefined && imageUrl) {
          project.imageUrl = imageUrl;
        } else if (project.images.length > 0) {
          project.imageUrl = project.images[0];
        } else {
          project.imageUrl = '';
        }
      } else if (imageUrl !== undefined) {
        project.imageUrl = imageUrl;
        if (imageUrl && (!project.images || project.images.length === 0)) {
          project.images = [imageUrl];
        }
      }

      project.codeTag = codeTag !== undefined ? codeTag : project.codeTag;
      project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
      project.liveLink = liveLink !== undefined ? liveLink : project.liveLink;
      project.order = order !== undefined ? Number(order) : project.order;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await Project.deleteOne({ _id: req.params.id });
      res.json({ message: 'Project removed successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
