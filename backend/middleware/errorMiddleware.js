export const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Error stack:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
};
