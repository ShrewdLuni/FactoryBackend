import express from 'express'
import { login, register, whoami } from 'controllers/authentication';
import { authenticate } from 'middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/whoami', authenticate, whoami)

export default router;
