import { Operation } from 'express-openapi';
import { checkSession, sessionParameters } from '../middleware/checkSession';
import { Session } from '../../sessionManager';
import { UserSessionData } from '../../types';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import cors from 'cors';

const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 2525,
    secure: false, // requires ssl or something, haven't figured it out, so only insecure works for now
    auth: {
        user: 'thedoc',
        pass: '123'
    }
});

export const POST: Operation = [
    cors(),
    checkSession(),
    async (req, res) => {

        try {

            const session = res.locals.session as Session<UserSessionData>;

            const recipientEmail = req.body[ 'email' ];
            const invoicePath = session.data.invoice?.pdfPath;

            if (!invoicePath) {

                throw new Error('no path to invoice');
            
            }

            if (!fs.existsSync(invoicePath)) {

                console.error('send-invoice - failed to find file at path:', invoicePath);
                throw new Error('file does not exist at given path');
            
            }

            console.log(`sending invoice to ${recipientEmail}`);

            const result = await transporter.sendMail({
                from: 'doctortest1337@gmail.com',
                to: recipientEmail,
                subject: 'Your Invoice',
                text: 'Thank you, attached is your invoice',
                attachments: [
                    {
                        filename: 'invoice.pdf',
                        path: invoicePath
                    }
                ]
            });

            if (!result.accepted) {

                throw new Error(`invoice not accepted to ${recipientEmail}`);
            
            }

            res.status(200).send('success');
        
        } catch (error) {
            
            res.status(500).send(`POST request error - ${error}`);

        }


    }
];

POST.apiDoc = {
    description: 'send invoice via provided destinations',

    parameters: [
        ...sessionParameters()
    ],

    requestBody: {
        description: 'destination info and options',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },

    responses: {
        200: {
            description: 'send success',
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