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

// Middlewares
app.use(cors());
app.use(express.json());

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

    // 2. Projects — not seeded. Add real projects via Admin Dashboard.

    // 3. Experiences — not seeded for fresher profile.
    // Add real experience from Admin Dashboard when available.

  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDatabase();
});
