const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createWorkoutSession,
  getWorkoutSessions,
  getWorkoutSessionExercises,
} = require('../controllers/progressController');

router.post('/workout-session', authMiddleware, createWorkoutSession);
router.get('/workout-sessions', authMiddleware, getWorkoutSessions);
router.get(
  '/workout-sessions/:sessionId/exercises',
  authMiddleware,
  getWorkoutSessionExercises
);

module.exports = router;