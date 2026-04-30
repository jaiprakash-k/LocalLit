import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database and socket setup
import { testConnection, syncDatabase } from './config/database.js';
import { initializeSocketIO } from './utils/socketIoSetup.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/reviews', reviewRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ==================== SOCKET.IO ====================

// Initialize Socket.io
const io = initializeSocketIO(httpServer, CORS_ORIGIN);

// ==================== SERVER STARTUP ====================

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync models with database
    await syncDatabase();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     BOOK EXCHANGE PLATFORM             ║
║     Backend Server Started             ║
╠════════════════════════════════════════╣
║                                        ║
║  🚀 Server running on port ${PORT}           ║
║  📡 API: http://localhost:${PORT}/api      ║
║  🔌 Socket.io listening...              ║
║  📊 Database: Connected                ║
║                                        ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, httpServer, io };
