const db = require('../config/db');

async function getNutritionByDate(req, res) {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    const [rows] = await db.query(
      `
      SELECT id, meal_type, food_name, calories, protein, carbs, fat, entry_date
      FROM nutrition_entries
      WHERE user_id = ? AND entry_date = ?
      ORDER BY id DESC
      `,
      [userId, date]
    );

    return res.json(rows);
  } catch (error) {
    console.log('GET NUTRITION BY DATE ERROR:', error);
    return res.status(500).json({ message: 'Could not load nutrition data.' });
  }
}

async function createNutritionFood(req, res) {
  try {
    const userId = req.user.id;
    const {
      meal_type,
      food_name,
      calories = 0,
      protein = 0,
      carbs = 0,
      fat = 0,
      entry_date,
    } = req.body;

    if (!meal_type || !food_name || !entry_date) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const [result] = await db.query(
      `
      INSERT INTO nutrition_entries
      (user_id, meal_type, food_name, calories, protein, carbs, fat, entry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        meal_type,
        food_name,
        Number(calories),
        Number(protein),
        Number(carbs),
        Number(fat),
        entry_date,
      ]
    );

    return res.status(201).json({
      id: result.insertId,
      message: 'Food created successfully.',
    });
  } catch (error) {
    console.log('CREATE NUTRITION FOOD ERROR:', error);
    return res.status(500).json({ message: 'Could not create food.' });
  }
}

async function updateNutritionFood(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      meal_type,
      food_name,
      calories = 0,
      protein = 0,
      carbs = 0,
      fat = 0,
    } = req.body;

    const [result] = await db.query(
      `
      UPDATE nutrition_entries
      SET
        meal_type = ?,
        food_name = ?,
        calories = ?,
        protein = ?,
        carbs = ?,
        fat = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
      `,
      [
        meal_type,
        food_name,
        Number(calories),
        Number(protein),
        Number(carbs),
        Number(fat),
        id,
        userId,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Food not found.' });
    }

    return res.json({ message: 'Food updated successfully.' });
  } catch (error) {
    console.log('UPDATE NUTRITION FOOD ERROR:', error);
    return res.status(500).json({ message: 'Could not update food.' });
  }
}

async function deleteNutritionFood(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM nutrition_entries
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Food not found.' });
    }

    return res.json({ message: 'Food removed successfully.' });
  } catch (error) {
    console.log('DELETE NUTRITION FOOD ERROR:', error);
    return res.status(500).json({ message: 'Could not remove food.' });
  }
}

async function getNutritionWater(req, res) {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    const [rows] = await db.query(
      `
      SELECT water_ml
      FROM nutrition_water
      WHERE user_id = ? AND entry_date = ?
      LIMIT 1
      `,
      [userId, date]
    );

    if (!rows.length) {
      return res.json({ water_ml: 1250 });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.log('GET NUTRITION WATER ERROR:', error);
    return res.status(500).json({ message: 'Could not load water data.' });
  }
}

async function upsertNutritionWater(req, res) {
  try {
    const userId = req.user.id;
    const { entry_date, water_ml = 1250 } = req.body;

    if (!entry_date) {
      return res.status(400).json({ message: 'Entry date is required.' });
    }

    const [rows] = await db.query(
      `
      SELECT id
      FROM nutrition_water
      WHERE user_id = ? AND entry_date = ?
      LIMIT 1
      `,
      [userId, entry_date]
    );

    if (rows.length) {
      await db.query(
        `
        UPDATE nutrition_water
        SET water_ml = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [Number(water_ml), rows[0].id]
      );
    } else {
      await db.query(
        `
        INSERT INTO nutrition_water (user_id, entry_date, water_ml)
        VALUES (?, ?, ?)
        `,
        [userId, entry_date, Number(water_ml)]
      );
    }

    return res.json({ message: 'Water saved successfully.' });
  } catch (error) {
    console.log('UPSERT NUTRITION WATER ERROR:', error);
    return res.status(500).json({ message: 'Could not save water.' });
  }
}

async function resetNutritionByDate(req, res) {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    await db.query(
      `
      DELETE FROM nutrition_entries
      WHERE user_id = ? AND entry_date = ?
      `,
      [userId, date]
    );

    await db.query(
      `
      DELETE FROM nutrition_water
      WHERE user_id = ? AND entry_date = ?
      `,
      [userId, date]
    );

    return res.json({ message: 'Nutrition reset successfully.' });
  } catch (error) {
    console.log('RESET NUTRITION ERROR:', error);
    return res.status(500).json({ message: 'Could not reset nutrition data.' });
  }
}

module.exports = {
  getNutritionByDate,
  createNutritionFood,
  updateNutritionFood,
  deleteNutritionFood,
  getNutritionWater,
  upsertNutritionWater,
  resetNutritionByDate,
};