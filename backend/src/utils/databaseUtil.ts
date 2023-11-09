import pg, { QueryConfig } from 'pg';

const { Pool } = pg;

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`;

console.log('DATABSE CONNECTION STRING:', connectionString);

export const pool = new Pool({
    connectionString: connectionString,
});

export async function query(queryConfig: QueryConfig): Promise<pg.QueryResult | undefined> {
    
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