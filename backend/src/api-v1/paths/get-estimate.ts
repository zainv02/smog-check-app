import { Operation } from 'express-openapi';
import cors from 'cors';
import { Fee, UserSessionData } from '../../types';
import { calculateFees } from '../../utils/invoiceUtil';
import { checkSession, sessionParameters } from '../middleware/checkSession';
import { Session } from '../../sessionManager';

export const GET: Operation = [
    cors(),
    checkSession({ noError: true }),
    async (req, res) => {

        try {

            // if session is supplied, return the fees from the session year
            if (res.locals.session) {

                const session = res.locals.session as Session<UserSessionData>;
                
                // calculate fees
                if (session.data.fees === undefined) {

                    if (!session.data.year) {

                        throw new Error('session does not have required information such as year');
                    
                    }

                    const fees: Fee[] = calculateFees({ year: session.data.year! });
                    session.data.fees = fees;
                
                }

                // calculate estimate
                if (session.data.estimate === undefined) {

                    let estimate = 0;
                    session.data.fees.forEach(({ amount }) => {

                        estimate += amount;
                    
                    });
                    session.data.estimate = estimate;
                
                }

                res.status(200).send(session.data.fees);

            
            } else if (req.query[ 'year' ]) {

                const year = parseInt(req.query[ 'year' ].toString());

                if (isNaN(year)) {

                    throw new Error(`given year [${req.query[ 'year' ]}] is not a number`);
                
                }

                const fees: Fee[] = calculateFees({ year });
                res.status(200).send(fees);

            } else {

                throw new Error('missing session or data (year)');
            
            }

        } catch (error) {
            
            res.status(400).send(`GET request error - ${error}`);

        }
    
    }
];

GET.apiDoc = {
    description: 'gets a list of fees that should add up to the estimate based on the vehicle info',

    parameters: [
        ...sessionParameters({ optional: true }),
        {
            required: false,
            description: 'the year of the vehicle',
            in: 'query',
            name: 'year',
            schema: {
                oneOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'number'
                    }
                ]
            },
            example: 1998
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
            $ref: '#/components/responses/Error'
        }
    }
};