import express from 'express';
import { LAB_OBJECTS, LAB_MATERIALS, LAB_COLORS, LAB_FINISHES } from '../../src/data/furnitureLabData.js';

const router = express.Router();

// GET /api/furniture — Get all 10 Hazzino laboratory furniture specifications
router.get('/', (req, res) => {
  const { category } = req.query;
  let items = LAB_OBJECTS;

  if (category && category !== 'ALL') {
    items = items.filter((item) => item.category === category.toUpperCase());
  }

  return res.json({
    success: true,
    count: items.length,
    data: items,
  });
});

// GET /api/furniture/:id — Get single furniture item
router.get('/:id', (req, res) => {
  const item = LAB_OBJECTS.find((o) => o.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Furniture item not found' });
  }
  return res.json({ success: true, data: item });
});

// GET /api/furniture/specs/options — Get material and color catalog
router.get('/specs/options', (req, res) => {
  return res.json({
    success: true,
    materials: LAB_MATERIALS,
    colors: LAB_COLORS,
    finishes: LAB_FINISHES,
  });
});

export default router;
