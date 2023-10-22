import express from 'express';
import dotenv from 'dotenv';
import { initialize } from 'express-openapi';
import apiDoc from './api-v1/openapi';
import path from 'path';
import * as http from 'node:http';
import { stop as stopDatabase } from './utils/databaseUtil';
import { SessionManager } from './sessionManager';
import { UserVehicleInfo } from './types';

// https://github.com/ajv-validator/ajv/issues/2132
// const Ajv = _Ajv as unknown as typeof _Ajv.default; 

// quick testing: curl -X POST http://localhost:4000/api/vehicle-info -H 'Content-Type: application/json' -d '{ "plate": "6LEE230", "state": "ca" }'

dotenv.config();

/**
 * express setup and middleware setup
 */
let server: http.Server;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// app.use(cors());



initialize({
    apiDoc,
    app,
    paths: path.resolve(__dirname, 'api-v1/paths'),//'./api-v1/paths',
    routesGlob: '**/*.{ts,js}',
    routesIndexFileRegExp: /(?:index)?\.[tj]s$/
});


// sessions

export const userSessionManager = new SessionManager(
    () => {

        return {
            id: ''
        } as UserVehicleInfo;
    
    }
);


process.on('SIGINT', async () => {
    
    console.log('Closing server');

    if (server !== undefined) {

        server.close((err) => {

            if (err) {

                console.error(`Error while closing server [${err}]`);
            
            }
            
        
        });
    
    }

    await stopDatabase();
    
    process.exit();

});




async function main() {

    server = app.listen(PORT, () => {

        console.log('Server is running on port '+ PORT);
    
    });

}

main();