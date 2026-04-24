const pool = require('../config/db');

async function createWorkoutSession(req, res, next) {
  let connection;

  try {
    const userId = req.user.id;
    const {
      workout_name,
      completed_sets,
      duration_minutes,
      completed_at,
      exercises,
    } = req.body;

    if (
      !workout_name ||
      completed_sets === undefined ||
      duration_minutes === undefined ||
      !completed_at
    ) {
      return res.status(400).json({
        message: 'Missing required fields.',
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [sessionResult] = await connection.execute(
      `INSERT INTO workout_sessions
      (user_id, workout_name, completed_sets, duration_minutes, completed_at)
      VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        String(workout_name),
        Number(completed_sets),
        Number(duration_minutes),
        completed_at,
      ]
    );

    const workoutSessionId = sessionResult.insertId;

    if (Array.isArray(exercises) && exercises.length > 0) {
      for (const exercise of exercises) {
        await connection.execute(
          `INSERT INTO workout_session_exercises
          (workout_session_id, exercise_name, completed_sets)
          VALUES (?, ?, ?)`,
          [
            workoutSessionId,
            String(exercise.exercise_name),
            Number(exercise.completed_sets || 0),
          ]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Workout session saved successfully.',
      sessionId: workoutSessionId,
    });
  } catch (error) {
  if (connection) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error('ROLLBACK ERROR:', rollbackError);
    }
  }
  console.error('CREATE_WORKOUT_SESSION ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

async function getWorkoutSessions(req, res, next) {
  try {
    const [sessions] = await pool.execute(
      `SELECT id, workout_name, completed_sets, duration_minutes, completed_at, created_at
       FROM workout_sessions
       WHERE user_id = ?
       ORDER BY completed_at DESC`,
      [req.user.id]
    );

    return res.json(sessions);
  } catch (error) {
  console.error('GET_WORKOUT_SESSIONS ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

async function getWorkoutSessionExercises(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT wse.id, wse.exercise_name, wse.completed_sets
       FROM workout_session_exercises wse
       INNER JOIN workout_sessions ws ON ws.id = wse.workout_session_id
       WHERE ws.user_id = ? AND ws.id = ?
       ORDER BY wse.id ASC`,
      [req.user.id, req.params.sessionId]
    );

    return res.json(rows);
  } catch (error) {
  console.error('GET_WORKOUT_SESSION_EXERCISES ERROR:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
}

module.exports = {
  createWorkoutSession,
  getWorkoutSessions,
  getWorkoutSessionExercises,
};