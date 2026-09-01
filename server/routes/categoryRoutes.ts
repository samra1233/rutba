import { Router } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../middleware/adminAuth';

const router = Router();

// GET /api/categories
router.get('/', (req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

// POST /api/categories
router.post('/', requireAdminAuth, (req, res) => {
  const cat = req.body;
  if (!cat || !cat.label) {
    return res.status(400).json({ error: 'Category label is required' });
  }
  const created = db.createCategory(cat);
  res.json(created);
});

// PUT /api/categories/:id
router.put('/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const updated = db.updateCategory(id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const success = db.deleteCategory(id);
  if (success) {
    res.json({ success: true, id });
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

export default router;

