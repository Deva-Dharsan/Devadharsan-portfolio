import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Full Stack Application',
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    detailedDescription: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    codeTag: {
      type: String,
      trim: true,
      default: '',
    },
    githubLink: {
      type: String,
      default: '',
    },
    liveLink: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
