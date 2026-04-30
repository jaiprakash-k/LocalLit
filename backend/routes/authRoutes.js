import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../utils/validators.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Authentication Routes
 */

// Register
router.post('/register', validateRegister, handleValidationErrors, register);

// Login
router.post('/login', validateLogin, handleValidationErrors, login);

// Logout (client-side token deletion mostly)
router.post('/logout', verifyToken, logout);

export default router;
