const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  try {
    const [projects] = await db.query('SELECT * FROM projects');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur projets' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Nom du projet requis' });

  try {
    await db.query('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description || ""]);
    res.status(201).json({ message: 'Projet créé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur création projet' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { name, description } = req.body;
  const { id } = req.params;

  try {
    await db.query('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    res.json({ message: 'Projet mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur mise à jour projet' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { id } = req.params;

  try {
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur suppression projet' });
  }
});

module.exports = router;
