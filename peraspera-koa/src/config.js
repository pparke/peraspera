import env from 'dotenv';

env.config({ silent: true });

export default {
  env: process.env.NODE_ENV,
  api: {
    port: process.env.SERVER_PORT || 3000
  },
  socketio: {
    port: process.env.SOCKET_PORT || 3030,
    host: process.env.SOCKET_HOST || 'localhost'
  },
  db: {
    host: process.env.SERVER_DB_HOST,
    name: process.env.SERVER_DB_DATABASE,
    port: process.env.SERVER_DB_PORT || 5432,
    user: process.env.SERVER_DB_USER,
    pass: process.env.SERVER_DB_PASSWORD
  }
};
