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
import { filterObject } from '../../utils/util';
import cors from 'cors';
import { calculateFees } from '../../utils/invoiceUtil';
import { Fee, UserSessionData } from '../../types';
import { checkSession, sessionParameters } from '../middleware/checkSession';
import { Session } from '../../sessionManager';


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
    checkSession(),
    async (req, res) => {
    
        try {

            const session = res.locals.session as Session<UserSessionData>;

            const vin = session.data.vin!;

            // get mileage
            if (session.data.mileage === undefined) {
            
                const vehicleData = await getVehicleData(vin);
    
                if (!vehicleData) {
    
                    throw new Error('failed to get vehicle data');
        
                }

                session.data.mileage = vehicleData[ 'economy' ][ 'mpg_combined' ];
            
            }

            // calculate fees
            if (session.data.fees === undefined) {

                const year = parseInt(`${session.data.year}`);

                if (isNaN(year)) {

                    throw new Error(`given year [${session.data.year}] is not a number`);
                
                }

                const fees: Fee[] = calculateFees({ year });
                session.data.fees = fees;
            
            }


            // if userState is unconfirmed (whether new or old customer), check:
            if (session.data.userState === undefined) {

                const databaseVehicleResult = await query({
                    text: 'SELECT "customer_id" FROM "automobiles" WHERE "vin" = $1',
                    values: [ vin ]
                });
    
                if (!databaseVehicleResult) {
    
                    throw new Error('database vehicle query failed');
                
                }
        
                // using result.rowCount seems to have a "possibly null" error on compile in docker
                if (databaseVehicleResult.rows.length > 0) {
        
                    const databaseCustomerResult = await query({
                        text: 'SELECT * FROM "customers" WHERE "id" = $1',
                        values: [ databaseVehicleResult.rows[ 0 ][ 'customer_id' ] ]
                    });
    
                    if (!databaseCustomerResult) {
    
                        throw new Error('database customer query failed');
                    
                    }
    
                    // if row is found, then it is a old user
                    if (databaseCustomerResult.rows.length > 0) {
    
                        session.data.userState = 'old';
                        const customerData = databaseCustomerResult.rows[ 0 ];
    
                        // console.log('customer result:', databaseCustomerResult.rows);
    
                        Object.assign(session.data, {
                            id: customerData[ 'id' ],
                            name: customerData[ 'name' ],
                            address: customerData[ 'address_1' ],
                            city: customerData[ 'city' ],
                            phone: customerData[ 'phone' ],
                            source: customerData[ 'source_id' ]
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
        ...sessionParameters()
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
            $ref: '#/components/responses/Error'
        }
    }
};