const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, authorizeRoles, hashPassword, verifyPassword, generateToken } = require('./auth');

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) return res.status(400).json({ message: 'Utilisateur existant' });

    const hashedPassword = await hashPassword(password);
    const role = 'user';
    await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);

    res.status(201).json({ message: 'Utilisateur créé', role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const user = users[0];
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Accès autorisé !', user: req.user });
});

router.post('/create-user', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { email, password, role } = req.body;
  const validRoles = ['user', 'manager', 'admin'];

  if (!email || !password || !role) return res.status(400).json({ message: 'Email, mot de passe et rôle requis' });
  if (!validRoles.includes(role)) return res.status(400).json({ message: 'Rôle invalide' });

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) return res.status(400).json({ message: 'Utilisateur existant' });

    const hashedPassword = await hashPassword(password);
    await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);

    res.status(201).json({ message: `Utilisateur ${role} créé avec succès` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
