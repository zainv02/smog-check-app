// import Ajv, { JSONSchemaType } from 'ajv';
import { getVehicleData, getVinData } from '../../utils/vehicleInfoUtil';
import { Operation } from 'express-openapi';

// const ajv = new Ajv();

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

export const POST: Operation = [
    async (req, res) => {

        // if (!validateLicensePlateInfo(req.body)) {

        //     res.status(400).send(`POST request error - invalid body ${JSON.stringify(req.body)}`);
        //     return;
        
        // }
    
        const vinData = await getVinData(req.body[ 'plate' ], req.body[ 'state' ]);
    
        if (!vinData) {
    
            res.status(400).send('POST request error - failed to get vin data');
            return;
        
        }
    
        const vehicleData = await getVehicleData(vinData[ 'vin' ]);
    
        if (!vehicleData) {
    
            res.status(400).send('POST request error - failed to get vehicle data');
            return;
        
        }
    
        res.send({
            vin: vinData[ 'vin' ],
            year: vinData[ 'year' ],
            make: vinData[ 'make' ],
            model: vinData[ 'model' ],
            plate: req.body[ 'plate' ],
            mileage: vehicleData[ 'economy' ][ 'mpg_combined' ]
        });
    
    }
];

POST.apiDoc = {
    description: 'get vehicle data from plate and state',

    requestBody: {
        description: 'license plate and state',
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        plate: {
                            type: 'string'
                        },
                        state: {
                            type: 'string'
                        }
                    },
                    additionalProperties: false
                },
                examples: {
                    MyCar: {
                        value: {
                            plate: '6LEE230',
                            state: 'ca'
                        }
                    }
                }
            }
        }
    },

    responses: {
        200: {
            description: 'Vehicle data for the request license plate and state',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/VehicleInfo'
                    },
                    // examples: {
                    //     MyCar: {
                    //         value: {
                    //             'vin':'JF1GE7E68AH505850',
                    //             'year':'2010',
                    //             'make':'Subaru',
                    //             'model':'Impreza',
                    //             'plate':'6LEE230',
                    //             'mileage':21
                    //         }
                    //     }
                    // }
                }
            }
            
        },
        default: {
            $ref: '#/components/responses/Error'
        }
    }
};