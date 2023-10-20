import pg, { QueryConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`,
});

export async function query(queryConfig: QueryConfig) {
    
    try {

        const client = await pool.connect();

        const res = await client.query(queryConfig);

        client.release();

        return res;
    
    } catch (error) {

        console.error('query error', error);
    
    }

}

export async function stop() {

    await pool.end();

}