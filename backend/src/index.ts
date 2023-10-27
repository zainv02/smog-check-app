import express from 'express';
import dotenv from 'dotenv';
import { initialize } from 'express-openapi';
import apiDoc from './api-v1/openapi';
import path from 'path';
import * as http from 'node:http';
import { stop as stopDatabase } from './utils/databaseUtil';
import { SessionManager } from './sessionManager';
import { UserSessionData } from './types';
import cors from 'cors';
import fs from 'node:fs';

// https://github.com/ajv-validator/ajv/issues/2132
// const Ajv = _Ajv as unknown as typeof _Ajv.default; 

// quick testing: curl -X POST http://localhost:4000/api/vehicle-info -H 'Content-Type: application/json' -d '{ "plate": "6LEE230", "state": "ca" }'

dotenv.config();

const SESSIONS_SAVE_DIR = '../temp';

/**
 * express setup and middleware setup
 */
let server: http.Server;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// app.use(cors());

// preflight cors for all api paths
app.options('/api-v1/*', cors());


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
            id: '',
            invoice: {},
        } satisfies UserSessionData as UserSessionData;
    
    }
);


async function main() {

    // load sessions

    const dir = path.resolve(__dirname + `/${SESSIONS_SAVE_DIR}`);

    console.log('loading sessions from: ', dir);
    
    // if (!fs.existsSync(dir)) {
    
    //     fs.mkdirSync(dir);
        
    // }

    const filePath = `${dir}/sessions.json`;

    try {

        const sessionsJson = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
        await userSessionManager.loadSessionsFromJson(sessionsJson);
        console.log('loaded sessions from json');
    
    } catch (error) {

        console.error('no sessions json found, not importing');
    
    }
    
    console.log('current sessions:', Object.fromEntries(userSessionManager.entries()));

    server = app.listen(PORT, () => {

        console.log('Server is running on port '+ PORT);
    
    });

}

main();


// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.stdin.resume(); // so the program will not close instantly

async function exitHandler(options: {cleanup?: boolean, exit?: boolean}, exitCode: number) {

    console.log('HANDLING EXIT');

    console.log('Closing server');

    if (server !== undefined) {

        server.close((err) => {

            if (err) {

                console.error(`Error while closing server [${err}]`);
            
            }
            
        
        });
    
    }

    await stopDatabase();

    // save sessions
    try {

        const sessionsJson = JSON.stringify(userSessionManager);

        const dir = path.resolve(__dirname + `/${SESSIONS_SAVE_DIR}`);
    
        console.log('saving sessions to: ', dir);
        
        if (!fs.existsSync(dir)) {
        
            fs.mkdirSync(dir);
            
        }
    
        const filePath = `${dir}/sessions.json`;
    
        fs.writeFileSync(filePath, sessionsJson);
    
        console.log('saved sessions');
    
    } catch (error) {

        console.error('failed to save sessions', error);
    
    }

    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();

}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{ cleanup:true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit:true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit:true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit:true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit:true }));