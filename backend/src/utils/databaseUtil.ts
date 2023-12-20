import pg, { QueryConfig, Pool } from 'pg';

let pool: Pool | undefined = undefined;

let lastConnectionString: string = '';

export async function refreshPool() {

    const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`;
    

    if (!pool) {

        console.log('DATABASE CONNECTION STRING:', connectionString);
        lastConnectionString = connectionString;
        pool = new Pool({
            connectionString: connectionString,
        });
    
    } else {

        if (lastConnectionString != connectionString) {

            console.log('DATABASE CONNECTION STRING:', connectionString);
            lastConnectionString = connectionString;
            await pool.end();
            pool = new Pool({
                connectionString: connectionString,
            });
        
        }
    
    }

    return pool;

}

export async function getClient(): Promise<pg.PoolClient> {

    await refreshPool();

    if (!pool) {

        throw new Error('pg pool failed to connect');
    
    }

    const client = await pool.connect();
    return client;

}

export async function query(queryConfig: QueryConfig): Promise<pg.QueryResult | undefined> {
    
    try {

        const client = await getClient();
        const res = await client.query(queryConfig);
        client.release();
        return res;
    
    } catch (error) {

        console.error('query error', error);
    
    }

}

export async function stop() {

    if (pool) {

        await pool.end();
        pool = undefined;
    
    }

}