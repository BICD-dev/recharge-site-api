import { Pool } from "pg";

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USERNAME,         // your postgres username
  host: process.env.DB_HOST,        // usually localhost
  database: process.env.DB_NAME, // your database name
  password: process.env.DB_PASSWORD,// the password you set during install
  port: Number(process.env.DB_PORT),               // default PostgreSQL port
});

export default pool;
