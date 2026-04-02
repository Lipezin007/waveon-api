const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  listWorkouts,
  getWorkoutById,
} = require('../controllers/workoutController');

router.get('/', authMiddleware, listWorkouts);
router.get('/:id', authMiddleware, getWorkoutById);

module.exports = router;