require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1h';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
  }
  next();
};

const hashPassword = async (password) => bcrypt.hash(password, 10);
const verifyPassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
const generateToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: TOKEN_EXPIRATION }
);

module.exports = { verifyToken, authorizeRoles, hashPassword, verifyPassword, generateToken };
