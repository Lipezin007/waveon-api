const pool = require('../config/db');

async function listWorkouts(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title FROM workouts ORDER BY id DESC'
    );

    // converte title → name (pro app continuar funcionando)
    const formatted = rows.map((w) => ({
      id: w.id,
      name: w.title,
    }));

    return res.json(formatted);
  } catch (error) {
  console.error('LIST_WORKOUTS ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

async function getWorkoutById(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, description FROM workouts WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    const workout = rows[0];

    return res.json({
      id: workout.id,
      name: workout.title,
      description: workout.description,
    });
  } catch (error) {
  console.error('GET_WORKOUT_BY_ID ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

module.exports = {
  listWorkouts,
  getWorkoutById,
};