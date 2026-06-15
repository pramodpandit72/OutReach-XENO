import express from 'express';
import passport from 'passport';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// ─── Local Auth ───────────────────────────────────────────
// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// ─── Google OAuth ─────────────────────────────────────────
// GET /auth/google  →  starts OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /auth/google/callback  →  Google redirects here
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    const isRender = process.env.RENDER === 'true';
    const frontendUrl = process.env.FRONTEND_URL || 
                        (isRender 
                          ? 'https://out-reach-xeno.vercel.app' 
                          : 'http://localhost:5173');
    res.redirect(`${frontendUrl}/dashboard`);
  }
);

// ─── Shared ───────────────────────────────────────────────
// GET /auth/me  →  returns current session user
router.get('/me', (req, res) => {
  // Support both Passport session (Google) and manual session (local)
  const user = req.user || req.session?.user || null;
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ user: null });
  }
});

// GET /auth/logout
router.get('/logout', (req, res, next) => {
  if (req.logout) {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
      });
    });
  } else {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  }
});

// POST /auth/logout (also support POST for frontend fetch calls)
router.post('/logout', (req, res, next) => {
  if (req.logout) {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
      });
    });
  } else {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  }
});

// GET /auth/failure
router.get('/failure', (req, res) => {
  const isRender = process.env.RENDER === 'true';
  const frontendUrl = process.env.FRONTEND_URL || 
                      (isRender 
                        ? 'https://out-reach-xeno.vercel.app' 
                        : 'http://localhost:5173');
  res.redirect(`${frontendUrl}?error=google_auth_failed`);
});

export default router;
