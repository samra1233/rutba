import { Router } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../middleware/adminAuth';
import { persistImageDataUrl } from '../services/firebaseStorageService';

const router = Router();

// GET /api/categories
router.get('/', (req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

// POST /api/categories
router.post('/', requireAdminAuth, async (req, res) => {
  const cat = { ...req.body };
  if (!cat || !cat.label) {
    return res.status(400).json({ error: 'Category label is required' });
  }
  try {
    if (typeof cat.image === 'string') cat.image = await persistImageDataUrl(cat.image, 'categories');
  } catch (_) {
    // Firebase Storage unavailable inside sandbox; keep local image as-is.
  }
  const created = db.createCategory(cat);
  res.json(created);
});

// PUT /api/categories/:id
router.put('/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const changes = { ...req.body };
  try {
    if (typeof changes.image === 'string') changes.image = await persistImageDataUrl(changes.image, 'categories');
  } catch (_) {
    // Firebase Storage unavailable inside sandbox; keep local image as-is.
  }
  const updated = db.updateCategory(id, changes);
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

