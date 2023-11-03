import { Operation } from 'express-openapi';
import cors from 'cors';
import { checkSession, sessionParameters } from '../middleware/checkSession';
import { Session } from '../../sessionManager';
import { UserSessionData } from '../../types';


export const GET: Operation = [
    cors(),
    checkSession(),
    async (req, res) => {

        try {

            const session = res.locals.session as Session<UserSessionData>;

            if (req.accepts('image/jpeg')) {
                
                if (session.data.invoice?.imageDataUrl) {

                    res.status(200).send(session.data.invoice.imageDataUrl);
                    return;

                } else {

                    // or create it?
                    throw new Error('session missing invoice as image');
                
                }

            } else if (req.accepts('application/pdf')) {
                
                if (session.data.invoice?.pdfPath) {

                    try {

                        res.status(200).sendFile(session.data.invoice.pdfPath);
                        return;
                    
                    } catch (error) {

                        throw new Error(`failed to send pdf - ${error}`);

                    }                    
                
                } else {

                    throw new Error('session missing invoice as pdf');
                
                }

            } else {

                throw new Error('unhandled format');
            
            }
            
        } catch (error) {

            res.status(400).send(`GET request error - ${error}`);
        
        }
    
    }
];

GET.apiDoc = {
    description: 'get a created invoice',
    
    parameters: [
        ...sessionParameters()
    ],

    responses: {
        200: {
            description: 'the invoice in requested format',
            content: {
                'application/pdf': {
                    schema: {
                        type: 'string',
                        format: 'binary'
                    }
                },
                'image/jpeg': {
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