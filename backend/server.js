import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import MongoStore from 'connect-mongo';

import connectDB from './config/db.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import User from './models/User.js';

// Routes
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import segmentRoutes from './routes/segmentRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Connect DB
connectDB();

// CORS – must be before routes and session
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'outreach_secret_2026',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// ─── Passport – Google OAuth ──────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Use localhost (not 127.0.0.1) to match Google Console URI
    callbackURL: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8000/auth/google/callback',
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Upsert user in DB
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Check if email already exists (local account)
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // Link Google to existing account
          user.googleId = profile.id;
          user.avatar = profile.photos[0]?.value;
          user.authProvider = 'google';
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
            authProvider: 'google',
          });
        }
      }

      const sessionUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };
      return done(null, sessionUser);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/', (req, res) => res.json({ status: 'OutReach CRM API running 🚀' }));
app.get('/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Error handler (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 OutReach CRM Backend running on http://localhost:${PORT}`);
});
