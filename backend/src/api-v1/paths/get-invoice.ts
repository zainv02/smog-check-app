import { Operation } from 'express-openapi';
import cors from 'cors';
import { userSessionManager } from '../..';


export const GET: Operation = [
    cors(),
    async (req, res) => {

        try {
        
            if (!req.query[ 'session' ]) {

                throw new Error('session missing from query');
            
            }

            const session = userSessionManager.getSession(req.query[ 'session' ] as string);

            if (!session) {

                throw new Error('failed to get session');
            
            }

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
        {
            required: false,
            in: 'query',
            name: 'session',
            schema: {
                type: 'string'
            }
        }
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