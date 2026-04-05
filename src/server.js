require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('BANCO CONECTADO COM SUCESSO');
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('ERRO AO CONECTAR NO BANCO:', error);
  }
}

startServer();