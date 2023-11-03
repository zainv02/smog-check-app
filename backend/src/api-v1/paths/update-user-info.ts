import { Operation } from 'express-openapi';
import cors from 'cors';
import { filterObject } from '../../utils/util';
import { checkSession, sessionParameters } from '../middleware/checkSession';
import { Session } from '../../sessionManager';
import { UserSessionData } from '../../types';



export const POST: Operation = [
    cors(),
    checkSession(),
    async (req, res) => {
        
        try {

            const session = res.locals.session as Session<UserSessionData>;
            
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
        ...sessionParameters()
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
            $ref: '#/components/responses/Error'
        }
    }
};