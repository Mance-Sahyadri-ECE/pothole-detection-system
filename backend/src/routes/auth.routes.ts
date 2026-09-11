import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.controller';

const router = Router();

// Government / Engineer Login Endpoint
router.post('/login', login);

// Token Verification Endpoint
router.get('/verify', verifyToken);

export default router;
