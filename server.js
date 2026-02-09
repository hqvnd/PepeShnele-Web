require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('Pepe Shnele API Server');

  console.log('=================================');
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API Port: ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api`);
  console.log('=================================');
  console.log('For Frontend (separate server):');
  console.log('   npm run frontend');
  console.log('Frontend URL: http://localhost:8000');
  console.log('=================================');  
  console.log('For API (backend):');
  console.log('   npm run dev');
  console.log('=================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});