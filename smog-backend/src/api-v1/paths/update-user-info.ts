import { Operation } from 'express-openapi';
import cors from 'cors';
import { userSessionManager } from '../..';
import { filterObject } from '../../utils/util';



export const POST: Operation = [
    cors(),
    async (req, res) => {
        
        try {

            const session = userSessionManager.getSession(req.query[ 'session' ] as string);

            if (!session) {

                throw new Error('failed to get session');
            
            }
            
            const data = req.body || {};

            // update the data in the session
            Object.assign(session.data, filterObject(data, [ 'name', 'phone', 'address', 'city', 'source', 'date' ]));

            console.log('updated session data. new session data:', session.data);

            res.status(200).send('updated data');
            
        } catch (error) {
         
            res.status(400).send(`POST request error - ${error}`);

        }

    }
];


POST.apiDoc = {
    description: 'update the user info',

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

    requestBody: {
        required: true,
        description: 'the info to update',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/UserInfo'
                }
            }
        }
    },

    responses: {
        200: {
            description: 'message for successful update',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string'
                    },
                    example: 'success'
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