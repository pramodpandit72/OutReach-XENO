import User from '../models/User.js';

// POST /auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(409).json({ error: 'Email already registered. Please log in.' });

    const user = new User({ name, email: normalizedEmail, password, authProvider: 'local' });
    await user.save();

    // Auto-login after register
    const sessionUser = { id: user._id, name: user.name, email: user.email, avatar: user.avatar };
    req.session.user = sessionUser;

    req.session.save((err) => {
      if (err) return next(err);
      res.status(201).json({ user: sessionUser });
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    if (user.authProvider === 'google')
      return res.status(400).json({ error: 'This email uses Google sign-in. Please use "Continue with Google".' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });

    const sessionUser = { id: user._id, name: user.name, email: user.email, avatar: user.avatar };
    req.session.user = sessionUser;

    req.session.save((err) => {
      if (err) return next(err);
      res.json({ user: sessionUser });
    });
  } catch (err) {
    next(err);
  }
};
