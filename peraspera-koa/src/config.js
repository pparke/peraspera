import env from 'dotenv';

env.config({ silent: true });

export default {
  env: process.env.NODE_ENV,
  api: {
    port: process.env.SERVER_PORT || 3000
  },
  db: {
    host: process.env.SERVER_DB_HOST,
    name: process.env.SERVER_DB_DATABASE,
    port: process.env.SERVER_DB_PORT || 5432,
    user: process.env.SERVER_DB_USER,
    pass: process.env.SERVER_DB_PASSWORD
  }
};
