import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

// api/auth/login
router.post('/login', login);

// api/auth/register (helper for dev)
router.post('/register', register);

export default router;
