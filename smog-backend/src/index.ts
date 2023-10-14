import express from 'express';
import dotenv from 'dotenv';
import { initialize } from 'express-openapi';
import cors from 'cors';
import apiDoc from './api-v1/openapi';
import path from 'path';
import * as http from 'node:http';
// import bodyParser from 'body-parser';
// import { default as Ajv, JSONSchemaType } from 'ajv';
// import { getVehicleData, getVinData } from './vehicleInfo';
// import { openapiSchemaToJsonSchema as toJsonSchema } from '@openapi-contrib/openapi-schema-to-json-schema';
// import YAML from 'yaml';
// import fs from 'fs';

// https://github.com/ajv-validator/ajv/issues/2132
// const Ajv = _Ajv as unknown as typeof _Ajv.default; 

// quick testing: curl -X POST http://localhost:4000/api/vehicle-info -H 'Content-Type: application/json' -d '{ "plate": "6LEE230", "state": "ca" }'

dotenv.config();
// const ajv = new Ajv();

/**
 * express setup and middleware setup
 */
let server: http.Server;
const app = express();
const PORT = process.env.port || 4000;

// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

app.use(express.json());

app.use(cors());


/**
 * api endpoints
 * 
 * user info (email, phone, name, address etc) on the top
 * and car info (VIN, year, make, model, LP, etc)
 */

// const openapiFile = fs.readFileSync('../schema/openapi.yml', 'utf8');
// const openapiSchemaYaml = YAML.parse(openapiFile);
// const openapiSchemaJson = toJsonSchema(openapiSchemaYaml);
// const validateVehicleData = ajv.compile(openapiSchemaJson);

// interface LicensePlateInfo {
//     plate: string,
//     state: string
// }

// const licensePlateInfoSchema: JSONSchemaType<LicensePlateInfo> = {
//     type: 'object',
//     properties: {
//         plate: { type: 'string' },
//         state: { type: 'string' }
//     },
//     required: [ 'plate', 'state' ],
//     additionalProperties: false,
// };

// const validateLicensePlateInfo = ajv.compile(licensePlateInfoSchema);

// app.post('/api/vehicle-info', async (req, res) => {

//     // console.log('body:', req.body);

//     if (!validateLicensePlateInfo(req.body)) {

//         res.status(400).send(`POST request error - invalid body ${JSON.stringify(req.body)}`);
//         return;
    
//     }

//     const vinData = await getVinData(req.body[ 'plate' ], req.body[ 'state' ]);

//     if (!vinData) {

//         res.status(400).send('POST request error - failed to get vin data');
//         return;
    
//     }

//     const vehicleData = await getVehicleData(vinData[ 'vin' ]);

//     if (!vehicleData) {

//         res.status(400).send('POST request error - failed to get vehicle data');
//         return;
    
//     }

//     res.send({
//         vin: vinData[ 'vin' ],
//         year: vinData[ 'year' ],
//         make: vinData[ 'make' ],
//         model: vinData[ 'model' ],
//         plate: req.body[ 'plate' ],
//         mileage: vehicleData[ 'economy' ][ 'mpg_combined' ]
//     });

// });

initialize({
    apiDoc,
    app,
    paths: path.resolve(__dirname, 'api-v1/paths'),//'./api-v1/paths',
    routesGlob: '**/*.{ts,js}',
    routesIndexFileRegExp: /(?:index)?\.[tj]s$/
});

app.use(((err, _req, res, _next) => {

    console.log(err);

    res.status(err.status).json(err);

}) as express.ErrorRequestHandler);




process.on('SIGINT', () => {
    
    console.log('Closing server');

    if (server !== undefined) {

        server.close((err) => {

            console.error(`Error while closing server [${err}]`);
        
        });
    
    }
    
    process.exit();

});




async function main() {

    server = app.listen(PORT, () => {

        console.log('Server is running on port '+ PORT);
    
    });

}

main();