import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, 'Role/Position is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration (e.g. Jan 2023 - Present) is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description details are required'],
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
