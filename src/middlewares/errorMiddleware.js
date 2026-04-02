function errorMiddleware(err, req, res, next) {
  console.error('ERRO REAL:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: 'Erro interno do servidor.',
    error: err.message
  });
}

module.exports = errorMiddleware;