const pool = require('../config/db');

async function createCustomWorkout(req, res, next) {
  let connection;

  try {
    const userId = req.user.id;
    const { name, category, exercises } = req.body;

    if (!name || !category || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        message: 'Name, category and at least one exercise are required.',
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [workoutResult] = await connection.execute(
      `INSERT INTO custom_workouts (user_id, name, category)
       VALUES (?, ?, ?)`,
      [userId, String(name), String(category)]
    );

    const customWorkoutId = workoutResult.insertId;

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];

      await connection.execute(
        `INSERT INTO custom_workout_exercises
         (custom_workout_id, exercise_name, exercise_order)
         VALUES (?, ?, ?)`,
        [
          customWorkoutId,
          String(exercise.name),
          i + 1,
        ]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Custom workout created successfully.',
      workoutId: customWorkoutId,
    });
  } catch (error) {
  if (connection) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error('ROLLBACK ERROR:', rollbackError);
    }
  }
  console.error('CREATE_CUSTOM_WORKOUT ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
} finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getCustomWorkouts(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT
        cw.id,
        cw.name,
        cw.category,
        cw.created_at,
        COUNT(cwe.id) AS exercises_count
      FROM custom_workouts cw
      LEFT JOIN custom_workout_exercises cwe
        ON cwe.custom_workout_id = cw.id
      WHERE cw.user_id = ?
      GROUP BY cw.id
      ORDER BY cw.created_at DESC`,
      [req.user.id]
    );

    return res.json(rows);
  } catch (error) {
  console.error('GET_CUSTOM_WORKOUTS ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

async function getCustomWorkoutById(req, res, next) {
  try {
    const workoutId = req.params.id;

    const [workouts] = await pool.execute(
      `SELECT id, name, category, created_at
       FROM custom_workouts
       WHERE id = ? AND user_id = ?`,
      [workoutId, req.user.id]
    );

    if (workouts.length === 0) {
      return res.status(404).json({
        message: 'Workout not found.',
      });
    }

    const [exercises] = await pool.execute(
      `SELECT id, exercise_name, exercise_order
       FROM custom_workout_exercises
       WHERE custom_workout_id = ?
       ORDER BY exercise_order ASC`,
      [workoutId]
    );

    return res.json({
      ...workouts[0],
      exercises: exercises.map((item) => ({
        id: item.id,
        name: item.exercise_name,
        order: item.exercise_order,
      })),
    });
  } catch (error) {
  console.error('GET_CUSTOM_WORKOUT_BY_ID ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

module.exports = {
  createCustomWorkout,
  getCustomWorkouts,
  getCustomWorkoutById,
};