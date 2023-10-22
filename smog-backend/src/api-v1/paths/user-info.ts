/**
 * get user info and car info given the plate and state (and name maybe)
 * 
 * example: 
vehicle result: [ { CustID: 'TITU001' } ]
customer result: [
  {
    Name: 'Titus, Steven Michael',
    Address1: '42 Parker ave',
    Address2: '',
    City: 'San Francisco',
    State: 'CA',
    ZipCode: '94118',
    HomePhone: null,
    WorkPhone: '415-387-6422 ',
    CustID: 'TITU001',
    LastIn: 2021-05-18T07:00:00.000Z,
    DollarsSpent: 319.75,
    Visits: 6,
    Phone1Desc: null,
    Phone2Desc: 'Cell Phone'
  }
 */

import { query } from '../../utils/databaseUtil';
import { getVehicleData, getVinData } from '../../utils/vehicleInfoUtil';
import { Operation } from 'express-openapi';
import { userSessionManager } from '../..';
import { UserVehicleInfo } from '../../types';


export const POST: Operation = [
    async (req, res) => {
    
        try {

            // to be filled with stuff
            const userVehicleInfo: UserVehicleInfo = {};

            // get vehicle data
            // either from vin api or from stored info for customer
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

            Object.assign(userVehicleInfo, {
                vin: vinData[ 'vin' ],
                year: vinData[ 'year' ],
                make: vinData[ 'make' ],
                model: vinData[ 'model' ],
                plate: req.body[ 'plate' ],
                mileage: vehicleData[ 'economy' ][ 'mpg_combined' ],
            });

            const databaseVehicleResult = await query({
                text: 'SELECT "CustID" FROM "Automobile" WHERE "AutoVIN" = $1',
                values: [ vinData[ 'vin' ] ]
            });

            if (!databaseVehicleResult) {

                throw new Error('database vehicle query failed');
            
            }
        
            // console.log('vehicle result:', databaseVehicleResult.rows);
    
            if (databaseVehicleResult.rowCount > 0) {
    
                const databaseCustomerResult = await query({
                    text: 'SELECT * FROM "Customer" WHERE "CustID" = $1',
                    values: [ databaseVehicleResult.rows[ 0 ][ 'CustID' ] ]
                });

                if (!databaseCustomerResult) {

                    throw new Error('database customer query failed');
                
                }

                if (databaseCustomerResult.rowCount > 0) {

                    const customerData = databaseCustomerResult.rows[ 0 ];

                    // console.log('customer result:', databaseCustomerResult.rows);

                    Object.assign(userVehicleInfo, {
                        id: customerData[ 'CustID' ],
                        name: customerData[ 'Name' ],
                        address: customerData[ 'Address1' ],
                        city: customerData[ 'City' ],
                        phone: customerData[ 'WorkPhone' ] || customerData[ 'HomePhone' ],
                        source: '',
                    });

                    res.status(200).send(userVehicleInfo);
                    return;
        
                } else {

                    // failed to find customer from custID??? maybe handle as new customer? or just error it
                    res.status(400).send('POST request error - failed to get customer data from customer id');
                    return;

                }
            
            } else {
    
                // possible new customer
                // console.log('failed to find customer from vin. new customer?');

                // send whatever is there
                res.status(200).send(userVehicleInfo);
                return;
            
            }
        
        } catch (error) {
            
            res.status(400).send(`POST request error - ${error}`);
            return;

        }

        
    
    }
];

POST.apiDoc = {
    description: 'get customer data from plate, state, and name if it exists, otherwise only what is available',

    requestBody: {
        description: 'name, plate, and state',
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
                        },
                        // name: {
                        //     type: 'string'
                        // }
                    },
                    required: [
                        'plate',
                        'state'
                    ],
                    additionalProperties: false
                },
                examples: {
                    MyCar: {
                        value: {
                            plate: '6LEE230',
                            state: 'CA',
                            // name: 'John'
                        }
                    }
                }
            }
        }
    },

    responses: {
        200: {
            description: 'Customer and vehicle data for the request license plate and state and name',
            content: {
                'application/json': {
                    schema: {
                        allOf: [
                            {
                                $ref: '#/components/schemas/VehicleInfo'
                            },
                            {
                                $ref: '#/components/schemas/UserInfo'
                            },
                            {
                                properties: {
                                    id: {
                                        type: 'string'
                                    },
                                    session: {
                                        type: 'string'
                                    }
                                },
                                required: [
                                    'id',
                                    'session'
                                ],
                                example: {
                                    'id': 'JON123',
                                    'session': 'acde070d-8c4c-4f0d-9d8a-162843c10333'
                                }
                            }
                        ],
                    },
                }
            }
            
        },
        default: {
            description: 'An error occurred',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string'
                    }
                }
            }
        }
    }
};