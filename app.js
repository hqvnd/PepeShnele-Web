const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',      // React/Vue dev
    'http://localhost:8000',      // Frontend http-server
    'http://127.0.0.1:8000',      // Frontend alternative localhost
    'http://127.0.0.1:3000'       // Alternative localhost
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// API info route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Pepe Shnele API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me (protected)'
      },
      users: {
        profile: 'GET /api/users/profile (protected)',
        updateProfile: 'PUT /api/users/profile (protected)',
        favorites: 'GET /api/users/favorites (protected)'
      },
      events: {
        getAll: 'GET /api/events',
        create: 'POST /api/events (protected)',
        getOne: 'GET /api/events/:id',
        update: 'PUT /api/events/:id (protected)',
        delete: 'DELETE /api/events/:id (protected)'
      },
      announcements: {
        getAll: 'GET /api/announcements',
        create: 'POST /api/announcements (protected)',
        getOne: 'GET /api/announcements/:id'
      }
    }
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Pepe Shnele API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      events: '/api/events',
      announcements: '/api/announcements'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

module.exports = app;