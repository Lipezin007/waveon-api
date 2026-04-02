const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createCustomWorkout,
  getCustomWorkouts,
  getCustomWorkoutById,
} = require('../controllers/customWorkoutController');

router.post('/', authMiddleware, createCustomWorkout);
router.get('/', authMiddleware, getCustomWorkouts);
router.get('/:id', authMiddleware, getCustomWorkoutById);

module.exports = router;