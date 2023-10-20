import axios from 'axios';

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`,
});

export async function query(queryConfig) {
    
    try {

        const client = await pool.connect();

        const res = await client.query(queryConfig);

        client.release();

        return res;
    
    } catch (error) {

        console.error('query error', error);
    
    }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getVinData(licensePlate, state) {

    const url = new URL(
        'https://platetovin.com/api/convert'
    );
    
    const headers = {
        'Authorization': 'THjzMgUEzJxG4eJ',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    let body = {
        'state': state,
        'plate': licensePlate
    };

    const result = await axios({
        url,
        method: 'post',
        headers,
        data: body
    });

    console.log(result.data);

    if (result.data[ 'success' ]) {

        return result.data[ 'vin' ];
    
    }

    return undefined;

}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getVehicleData(vin) {

    const url = new URL(
        'https://platetovin.com/api/vin-lookup'
    );

    const headers = {
        'Authorization': 'THjzMgUEzJxG4eJ',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    let body = {
        'vin': vin
    };

    const result = await axios({
        url,
        method: 'post',
        headers,
        data: body
    });

    console.log(result.data);

    if (result.data[ 'success' ]) {

        return result.data[ 'data' ];
    
    }

    return undefined;

}


async function main() {

    // const headers = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    // };

    // const result = await axios({
    //     url: 'http://localhost:4000/api/vehicle-info',
    //     method: 'post',
    //     headers,
    //     data: {
    //         plate: '6LEE230',
    //         state: 'ca',
    //     },
    // });

    // console.log('api test:', result.data);
    // test vin: 1C4BJWFG2EL308192
    try {

        const vehicleResult = await query({
            text: 'SELECT "CustID" FROM "Automobile" WHERE "AutoVIN" = $1',
            values: [ '1C4BJWFG2EL308192' ]
        });
    
        console.log('vehicle result:', vehicleResult.rows);

        if (vehicleResult.rowCount > 0) {

            const customerResult = await query({
                text: 'SELECT * FROM "Customer" WHERE "CustID" = $1',
                values: [ vehicleResult.rows[ 0 ][ 'CustID' ] ]
            });
    
            console.log('customer result:', customerResult.rows);
        
        } else {

            console.log('failed to find customer from vin. new customer?');
        
        }
    
        
    
    } catch (error) {

        console.error('error!', error);
    
    }

    

    // const result = await query({
    //     text: 'SELECT * FROM "Customer" WHERE true LIMIT 5',
    //     values: []
    // });

    

    await pool.end();

}

main();