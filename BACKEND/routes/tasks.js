const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./auth');

// 🔹 Récupérer toutes les tâches (admin only)
router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  try {
    const [tasks] = await db.query(`
      SELECT t.id, t.title, t.description, t.status, t.project_id, t.assigned_to,
             p.name AS project_name, u.email AS assigned_email
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
    `);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur tâches' });
  }
});

// 🔹 Créer une tâche
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { title, description, project_id, assigned_to, status } = req.body;
  if (!title) return res.status(400).json({ message: 'Titre de la tâche requis' });

  try {
    await db.query(
      'INSERT INTO tasks (title, description, project_id, assigned_to, status) VALUES (?, ?, ?, ?, ?)',
      [title, description || "", project_id || null, assigned_to || null, status || 'pending']
    );
    res.status(201).json({ message: 'Tâche créée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur création tâche' });
  }
});

// 🔹 Modifier une tâche
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { title, description, project_id, assigned_to, status } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      'UPDATE tasks SET title = ?, description = ?, project_id = ?, assigned_to = ?, status = ? WHERE id = ?',
      [title, description, project_id, assigned_to, status, id]
    );
    res.json({ message: 'Tâche mise à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur mise à jour tâche' });
  }
});

// 🔹 Supprimer une tâche
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const { id } = req.params;

  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur suppression tâche' });
  }
});

module.exports = router;
