import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Experience from './models/Experience.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares — allow large payload for multiple base64 image uploads
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Seed or update admin user, projects, and experiences
const seedDatabase = async () => {
  try {
    // 1. Seed/Update Admin
    const email = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const password = process.env.ADMIN_PASSWORD || 'adminpassword123';

    const adminUser = await User.findOne();
    if (!adminUser) {
      const admin = new User({
        email,
        password,
      });
      await admin.save();
      console.log(`Default Admin seeded. Email: ${email}`);
    } else {
      let updated = false;
      if (adminUser.email !== email) {
        adminUser.email = email;
        updated = true;
      }

      const isMatch = await adminUser.matchPassword(password);
      if (!isMatch) {
        adminUser.password = password;
        updated = true;
      }

      if (updated) {
        await adminUser.save();
        console.log(`Admin user updated in database. Email: ${email}`);
      }
    }

    // 2. Ensure default showcase projects exist in database
    const portfolioProj = await Project.findOne({ title: 'Personal Developer Portfolio' });
    if (!portfolioProj) {
      const defaultProjects = [
        {
          title: 'Personal Developer Portfolio',
          category: 'Full Stack · MERN Stack',
          description:
            'High-performance personal developer portfolio and administrative CMS with dark glassmorphism, English matrix hacker authentication, dynamic experience & project CRUD, and contact dispatch.',
          detailedDescription:
            'A high-performance personal portfolio and administrative content management engine designed for modern web developers.\n\nKey Features & Architecture:\n• Responsive dark glassmorphism interface with custom CSS variables and smooth transitions\n• Falling English hacker-word canvas rain effect on admin authentication portal\n• Secure JWT-based access control with bcrypt password hashing\n• Real-time REST API endpoints for dynamic experience, project, and message management\n• Automated contact inquiry dispatch and instant client-side form validation\n• Optimized for high accessibility, lighthouse performance, and all screen viewports',
          tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'JWT'],
          imageUrl: '',
          images: [],
          codeTag: 'Portfolio.jsx',
          githubLink: 'https://github.com/Deva-Dharsan',
          liveLink: 'https://dharsan-dev.vercel.app/',
          order: 1,
        },
        {
          title: 'Tourism Information & Booking Portal',
          category: 'Web Application · Infosys',
          description:
            'Interactive tourism reservation and exploration platform developed during Infosys internship featuring destination search, tour packages, and reservation flow.',
          detailedDescription:
            'Engineered during the Infosys Web Development Virtual Internship.\n\nKey Features & Architecture:\n• Intuitive, responsive web application for exploring destinations and attractions\n• Dynamic search and package filtering by category, duration, and budget\n• Interactive tour reservation flow with client-side form validation\n• Responsive card grid layout adapted for mobile, tablet, and desktop screens\n• Modular JavaScript architecture with structured data handling',
          tags: ['JavaScript', 'HTML5', 'CSS3', 'Web Portal', 'Responsive Design'],
          imageUrl: '',
          images: [],
          codeTag: 'TourismApp.js',
          githubLink: 'https://github.com/Deva-Dharsan',
          liveLink: '',
          order: 2,
        },
        {
          title: 'MEAN Stack Task & Workspace Hub',
          category: 'Full Stack · MEAN Stack',
          description:
            'Modular task planning and workspace coordination dashboard built with Angular, TypeScript, Node.js, Express, and MongoDB for agile project tracking and reactive workflows.',
          detailedDescription:
            'Full-stack productivity workspace built on the MEAN (MongoDB, Express, Angular, Node) architecture.\n\nKey Features & Architecture:\n• Angular component architecture with TypeScript strict typing\n• Reactive forms with custom asynchronous validators\n• State management and event streams powered by RxJS Observables\n• Node.js & Express RESTful API with structured routing and middleware\n• MongoDB & Mongoose schema design with indexing for rapid querying',
          tags: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'RxJS'],
          imageUrl: '',
          images: [],
          codeTag: 'TaskHub.component.ts',
          githubLink: 'https://github.com/Deva-Dharsan',
          liveLink: '',
          order: 3,
        },
      ];
      await Project.insertMany(defaultProjects);
      console.log('Default showcase projects seeded into database.');
    }

    // Also update any legacy project without a category
    await Project.updateMany(
      { category: { $exists: false } },
      { $set: { category: 'Full Stack Application' } }
    );

    // 3. Experiences — not seeded for fresher profile.
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDatabase();
});
