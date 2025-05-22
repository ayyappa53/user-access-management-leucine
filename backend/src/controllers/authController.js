const bcrypt = require('bcrypt');
const AppDataSource = require('../config/database');
const { generateToken } = require('../services/jwtService');
const User = require('../entities/User');

const getUserRepository = async () => {
  return AppDataSource.getRepository(User);
};

const signup = async (req, res) => {
  try {
    const { username, password, role = 'Employee' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const userRepository = await getUserRepository();
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userRepository.save({
      username,
      password: hashedPassword,
      role: role
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const userRepository = await getUserRepository();
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userRepository = await getUserRepository();
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

module.exports = {
  signup,
  login,
  getProfile
};