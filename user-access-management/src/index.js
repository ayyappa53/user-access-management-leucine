require('dotenv').config();
const { app, initializeDatabase } = require('./app');

const PORT = process.env.PORT || 3001;


const startServer = async () => {

  await initializeDatabase();
  

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
  });
};


process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});


startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});