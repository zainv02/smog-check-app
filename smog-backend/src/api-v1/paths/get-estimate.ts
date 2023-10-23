import { Operation } from 'express-openapi';
import cors from 'cors';
import { userSessionManager } from '../..';
import { Fee } from '../../types';
import { calculateFees } from '../../utils/invoiceUtil';

export const GET: Operation = [
    cors(),
    async (req, res) => {

        try {
            
            const session = userSessionManager.getSession(req.query[ 'session' ] as string);

            if (!session) {

                throw new Error('failed to get session');
            
            }

            if (session.data.fees === undefined) {

                const fees: Fee[] = calculateFees({ year: session.data.year! });
                session.data.fees = fees;
            
            }

            res.status(200).send(session.data.fees);

        } catch (error) {
            
            res.status(400).send(`GET request error - ${error}`);

        }
    
    }
];

GET.apiDoc = {
    description: 'gets a list of fees that should add up to the estimate based on the vehicle info',

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
            description: 'the fees and estimate',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            fees: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        label: {
                                            type: 'string'
                                        },
                                        amount: {
                                            type: 'number'
                                        }
                                    }
                                }
                            }
                        },
                        example: {
                            fees: [
                                {
                                    label: 'Smog inspection',
                                    amount: 85
                                }
                            ]
                        } satisfies { fees: Fee[] }
                    }
                }
            }
        },
        default: {
            description: 'an error occurred',
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