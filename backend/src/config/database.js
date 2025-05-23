const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'user_access_management',
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    require('../entities/User'),
    require('../entities/Software'),
    require('../entities/Request')
  ]
});

module.exports = AppDataSource;