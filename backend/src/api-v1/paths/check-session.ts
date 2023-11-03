import { Operation } from 'express-openapi';
import cors from 'cors';
import { checkSession, sessionParameters } from '../middleware/checkSession';

export const GET: Operation = [
    cors(),
    checkSession(),
    async (req, res) => {

        res.status(200).send('found session');
    
    }
];

GET.apiDoc = {
    description: 'check if session is valid',
    
    parameters: [
        ...sessionParameters()
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
            $ref: '#/components/responses/Error'
        }
    }
};