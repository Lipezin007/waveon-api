const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  updateUserPlan,
} = require('../controllers/userController');

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.put('/plan', authMiddleware, updateUserPlan);

module.exports = router;