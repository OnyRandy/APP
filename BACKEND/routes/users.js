const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  try {
    const [users] = await db.query('SELECT id, email, role FROM users');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur utilisateurs' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: 'Données manquantes' });

  try {
    const hashedPassword = await require('bcryptjs').hash(password, 10);
    await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur création utilisateur' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { email, role } = req.body;
  const { id } = req.params;

  try {
    await db.query('UPDATE users SET email = ?, role = ? WHERE id = ?', [email, role, id]);
    res.json({ message: 'Utilisateur mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur mise à jour utilisateur' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { id } = req.params;

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur suppression utilisateur' });
  }
});

module.exports = router;
