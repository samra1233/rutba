import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json([
    { id: 'chiffon-26', name: 'Festive Chiffon 26', slug: 'festive-chiffon-26', count: 3, cover: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600' },
    { id: 'lawn-26', name: 'Festive Lawn 26', slug: 'festive-lawn-26', count: 3, cover: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600' },
    { id: 'printed-26', name: 'Classic Printed 26', slug: 'classic-printed-26', count: 3, cover: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&q=80&w=600' }
  ]);
});

export default router;
