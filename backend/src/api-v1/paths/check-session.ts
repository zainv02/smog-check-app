import { Operation } from 'express-openapi';
import cors from 'cors';
import { userSessionManager } from '../..';

export const GET: Operation = [
    cors(),
    async (req, res) => {

        try {
            
            const session = userSessionManager.getSession(req.query[ 'session' ] as string);

            if (!session) {

                throw new Error(`session [${req.query[ 'session' ]}] not found`);
            
            }

            res.status(200).send('found session');

        } catch (error) {
            
            res.status(400).send(`GET request error - ${error}`);

        }
    
    }
];

GET.apiDoc = {
    description: 'check if session is valid',
    
    parameters: [
        {
            required: true,
            in: 'query',
            name: 'session',
            schema: {
                type: 'string'
            }
        }
    ],

    responses: {
        200: {
            description: 'found session and it\'s valid',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string'
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