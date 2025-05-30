// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../model/User');

// Generate JWT tokens
const generateTokens = (userId) => {
  const token = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' }, 
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return { token, refreshToken };
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required'
      });
    }

    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Find user by email and check if active
    const user = await User.findActiveUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user role matches requested role
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `You don't have ${role} access`
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user._id);

    // Add refresh token to user
    await user.addRefreshToken(refreshToken);
    await user.updateLastLogin();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // Generate tokens
    const { token, refreshToken } = generateTokens(user._id);

    // Add refresh token to user
    await user.addRefreshToken(refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh token controller
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const hasValidRefreshToken = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!hasValidRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { token, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Remove old refresh token and add new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Logout controller
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.userId;

    if (refreshToken && userId) {
      const user = await User.findById(userId);
      if (user) {
        await user.removeRefreshToken(refreshToken);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};