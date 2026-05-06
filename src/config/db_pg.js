import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let params = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
};

if (process.env.PG_SSL) {
    params.ssl = {
        rejectUnauthorized: false
    };
}

const pool = new pg.Pool(params);
export default pool;