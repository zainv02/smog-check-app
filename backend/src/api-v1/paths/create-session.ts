/**
 * Create a new session
 * 
 */

import { userSessionManager } from '../..';
import { Operation } from 'express-openapi';
import { getVinData } from '../../utils/vehicleInfoUtil';
import cors from 'cors';

// preflight cors apparently
// so look in INDEX for a handle

export const POST: Operation = [
    cors({
        // origin: 'http://localhost:3000/'
    }),
    async (req, res) => {

        try {

            // get vehicle data
            // either from vin api or from stored info for customer
            const vinData = await getVinData(req.body[ 'plate' ], req.body[ 'state' ]);
    
            if (!vinData) {
    
                res.status(400).send('POST request error - failed to get vin data');
                return;
        
            }

            const session = await userSessionManager.createSession();

            console.log(`new session [${session.getId()}] created`, session);

            Object.assign(session.data, {
                vin: vinData[ 'vin' ],
                year: vinData[ 'year' ],
                make: vinData[ 'make' ],
                model: vinData[ 'model' ],
                plate: req.body[ 'plate' ]
            });

            // get customer data too

            res.status(200).send(session.getId());
        
        } catch (error) {

            res.status(400).send(`POST request error - ${error}`);
        
        }

    }
];

POST.apiDoc = {
    description: 'get a user session from plate and state and maybe name',

    requestBody: {
        description: 'plate, state, and maybe name',
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
            description: 'the session id',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string'
                    },
                    example: 'acde070d-8c4c-4f0d-9d8a-162843c10333'
                }
            }
        },
        default: {
            $ref: '#/components/responses/Error'
        }
    }
};