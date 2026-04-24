const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {
  getNutritionByDate,
  createNutritionFood,
  updateNutritionFood,
  deleteNutritionFood,
  getNutritionWater,
  upsertNutritionWater,
  resetNutritionByDate,
} = require('../controllers/nutritionController');

router.get('/nutrition', authMiddleware, getNutritionByDate);
router.post('/nutrition/foods', authMiddleware, createNutritionFood);
router.put('/nutrition/foods/:id', authMiddleware, updateNutritionFood);
router.delete('/nutrition/foods/:id', authMiddleware, deleteNutritionFood);

router.get('/nutrition/water', authMiddleware, getNutritionWater);
router.put('/nutrition/water', authMiddleware, upsertNutritionWater);

router.delete('/nutrition/reset', authMiddleware, resetNutritionByDate);

module.exports = router;