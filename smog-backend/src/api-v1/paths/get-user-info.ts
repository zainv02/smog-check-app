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
import { getVehicleData } from '../../utils/vehicleInfoUtil';
import { Operation } from 'express-openapi';
import { userSessionManager } from '../..';
// import { UserVehicleInfo } from '../../types';
import { filterObject } from '../../utils/util';
import cors from 'cors';


function createResponseBody(obj: object): object {

    return filterObject(obj, [
        // user info
        'name', 
        'address', 
        'city', 
        'phone',
        'source',
        // vehicle info
        'year',
        'make',
        'model',
        'plate',
        'mileage',
        'vin'
    ]);

}


export const GET: Operation = [
    cors(),
    async (req, res) => {
    
        try {

            // to be filled with stuff
            // const userVehicleInfo: UserVehicleInfo = {};

            // // get vehicle data
            // // either from vin api or from stored info for customer
            // const vinData = await getVinData(req.body[ 'plate' ], req.body[ 'state' ]);
    
            // if (!vinData) {
    
            //     res.status(400).send('POST request error - failed to get vin data');
            //     return;
        
            // }
    
            //  in here consider looking into customer info

            const session = userSessionManager.getSession(req.query[ 'session' ] as string);
            
            if (!session) {

                throw new Error('failed to get session');
            
            }

            const vin = session.data.vin!;

            if (session.data.mileage === undefined) {
            
                const vehicleData = await getVehicleData(vin);
    
                if (!vehicleData) {
    
                    throw new Error('failed to get vehicle data');
        
                }

                session.data.mileage = vehicleData[ 'economy' ][ 'mpg_combined' ];

                // Object.assign(session.data, {
                //     vin: vinData[ 'vin' ],
                //     year: vinData[ 'year' ],
                //     make: vinData[ 'make' ],
                //     model: vinData[ 'model' ],
                //     plate: req.body[ 'plate' ],
                //     mileage: vehicleData[ 'economy' ][ 'mpg_combined' ],
                // });
            
            }


            // if userState is unconfirmed (whether new or old customer), check:
            if (session.data.userState === undefined) {

                const databaseVehicleResult = await query({
                    text: 'SELECT "CustID" FROM "Automobile" WHERE "AutoVIN" = $1',
                    values: [ vin ]
                });
    
                if (!databaseVehicleResult) {
    
                    throw new Error('database vehicle query failed');
                
                }
        
                if (databaseVehicleResult.rowCount > 0) {
        
                    const databaseCustomerResult = await query({
                        text: 'SELECT * FROM "Customer" WHERE "CustID" = $1',
                        values: [ databaseVehicleResult.rows[ 0 ][ 'CustID' ] ]
                    });
    
                    if (!databaseCustomerResult) {
    
                        throw new Error('database customer query failed');
                    
                    }
    
                    // if row is found, then it is a old user
                    if (databaseCustomerResult.rowCount > 0) {
    
                        session.data.userState = 'old';
                        const customerData = databaseCustomerResult.rows[ 0 ];
    
                        // console.log('customer result:', databaseCustomerResult.rows);
    
                        Object.assign(session.data, {
                            id: customerData[ 'CustID' ],
                            name: customerData[ 'Name' ],
                            address: customerData[ 'Address1' ],
                            city: customerData[ 'City' ],
                            phone: customerData[ 'WorkPhone' ] || customerData[ 'HomePhone' ],
                            source: '', // need to add a source column to the customer database
                        });
            
                    } else {

                        session.data.userState = 'new';
    
                        // failed to find customer from custID??? maybe handle as new customer? or just error it
                        // throw new Error('failed to get customer data from customer id');
    
                    }
                
                }
            
            }

            // send whatever data is filled
            res.status(200).send(createResponseBody(session!.data));
        
        } catch (error) {
            
            res.status(400).send(`GET request error - ${error}`);
            return;

        }

        
    
    }
];

GET.apiDoc = {
    description: 'get customer data from plate, state, and name if it exists, otherwise only what is available',

    parameters: [
        {
            required: true,
            description: 'the session id',
            in: 'query',
            name: 'session',
            schema: {
                type: 'string'
            }
        }
    ],

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
                            // {
                            //     properties: {
                            //         id: {
                            //             type: 'string'
                            //         }
                            //     },
                            //     required: [
                            //         'id'
                            //     ],
                            //     example: {
                            //         'id': 'JON123'
                            //     }
                            // }
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