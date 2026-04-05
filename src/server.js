require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('🔥 BANCO CONECTADO COM SUCESSO');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ ERRO AO CONECTAR NO BANCO:', error);
  }
}

startServer();