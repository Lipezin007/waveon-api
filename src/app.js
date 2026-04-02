const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const progressRoutes = require('./routes/progressRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const customWorkoutRoutes = require('./routes/CustomWorkoutRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'WaveOn API online' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);
app.use('/progress', progressRoutes);
app.use('/custom-workouts', customWorkoutRoutes);

app.use(errorMiddleware);

module.exports = app;