import { Router } from 'express';
import { login, loginCitizen, registerCitizen, verifyToken } from '../controllers/auth.controller';

const router = Router();

// Government / Engineer Login Endpoint
router.post('/login', login);
router.post('/login-government', login);

// Citizen Portal Auth Endpoints
router.post('/login-citizen', loginCitizen);
router.post('/register-citizen', registerCitizen);

// Token Verification Endpoint
router.get('/verify', verifyToken);

export default router;
