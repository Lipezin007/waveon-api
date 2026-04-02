const pool = require('../config/db');

async function getProfile(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        email,
        body_type,
        goal,
        weight,
        height,
        age,
        plan,
        created_at
      FROM users
      WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const name = req.body?.name?.trim() || null;
    const body_type = req.body?.body_type?.trim() || null;
    const goal = req.body?.goal?.trim() || null;

    const weight =
      req.body?.weight === '' || req.body?.weight === undefined
        ? null
        : Number(req.body.weight);

    const height =
      req.body?.height === '' || req.body?.height === undefined
        ? null
        : Number(req.body.height);

    const age =
      req.body?.age === '' || req.body?.age === undefined
        ? null
        : Number(req.body.age);

    if (!name) {
      return res.status(400).json({
        message: 'Name is required.',
      });
    }

    await pool.execute(
      `UPDATE users
       SET name = ?, body_type = ?, goal = ?, weight = ?, height = ?, age = ?
       WHERE id = ?`,
      [name, body_type, goal, weight, height, age, req.user.id]
    );

    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        email,
        body_type,
        goal,
        weight,
        height,
        age,
        plan,
        created_at
      FROM users
      WHERE id = ?`,
      [req.user.id]
    );

    return res.json({
      message: 'Perfil atualizado com sucesso.',
      user: rows[0],
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserPlan(req, res, next) {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    if (!plan || !['free', 'premium'].includes(plan)) {
      return res.status(400).json({
        message: 'Invalid plan',
      });
    }

    await pool.execute(
      'UPDATE users SET plan = ? WHERE id = ?',
      [plan, userId]
    );

    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        email,
        body_type,
        goal,
        weight,
        height,
        age,
        plan,
        created_at
      FROM users
      WHERE id = ?`,
      [userId]
    );

    return res.status(200).json({
      message: 'Plan updated successfully',
      user: rows[0],
    });
  } catch (error) {
    console.error('ERROR UPDATE PLAN:', error);
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updateUserPlan,
};