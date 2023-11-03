import { Operation } from 'express-openapi';
import fs from 'node:fs';
import path from 'node:path';
import { createInvoice } from '../../utils/invoiceUtil';
import * as pdfjsLib from 'pdfjs-dist';

import { createCanvas } from 'canvas';
import { filterObject } from '../../utils/util';
import jsPDF from 'jspdf';

import cors from 'cors';
import { checkSession, sessionParameters } from '../middleware/checkSession';
import { UserSessionData } from '../../types';
import { Session } from '../../sessionManager';

// consider making this pull data from database instead?

export const INVOICE_DIRECTORY = path.resolve(__dirname + '/../../../temp');

export const POST: Operation = [
    cors(),
    checkSession(),
    async (req, res) => {

        try {

            const session = res.locals.session as Session<UserSessionData>;

            if (!req.body[ 'signature' ]) {

                throw new Error('request body missing signature');
            
            }

            session.data.signature = req.body[ 'signature' ];

            // console.log('current dir', path.resolve('.'));
            const dir = INVOICE_DIRECTORY;

            console.log('saving pdfs to: ', dir);
    
            if (!fs.existsSync(dir)) {
    
                fs.mkdirSync(dir);
        
            }

            const pdfPath = dir + '/' + `invoice-${session.getId()}.pdf`;

            // console.log('prefiltered data', session.data);

            const invoiceData = filterObject(session.data, [ 
                'name', 
                'address',
                'phone',
                'city',
                'source',
                'date',
                'vin', 
                'year', 
                'make',
                'model',
                'plate',
                'mileage',
                'fees',
                'estimate',
                'signature'
            ]);
            
            let doc: jsPDF;

            try {

                console.log('generating pdf with data', invoiceData);

                doc = createInvoice(invoiceData);

                console.log('generated pdf, saving');

                doc.save(pdfPath);

                console.log('saved to', pdfPath);

                session.data.invoice!.pdfPath = pdfPath;
            
            } catch (error) {

                throw new Error(`failed to create invoice pdf - ${error}`);
            
            }
            // res.status(200).sendFile(pdfPath);

            try {

                console.log('generating image');

                const pdfDoc = await pdfjsLib.getDocument({ 
                    data: doc.output('arraybuffer'),
                    // https://github.com/mozilla/pdf.js/issues/4244
                    // instead of relying on the node module, i put the fonts in the local directory
                    standardFontDataUrl: path.resolve(__dirname + '/../../../standard_fonts') + '/'
                }).promise;

                const page = await pdfDoc.getPage(1);

                const viewport = page.getViewport({ scale: 1, });

                const canvas = createCanvas(viewport.width, viewport.height);

                await page.render({
                    canvasContext: canvas.getContext('2d') as unknown as CanvasRenderingContext2D,
                    viewport
                }).promise;

                const imageDataUrl = canvas.toDataURL('image/jpeg');

                session.data.invoice!.imageDataUrl = imageDataUrl;

                console.log('genereted image');
            
            } catch (error) {
                
                console.error(`failed to create invoice image - ${error}`);
            
            }

            // res.status(200).send(imageDataUrl);

            res.status(200).send('success');
        
        } catch (error) {

            res.status(400).send(`POST request error - ${error}`);
            console.error('create invoice request error', error);
        
        }

    }

];


POST.apiDoc = {
    description: 'create an invoice from given data',

    parameters: [
        ...sessionParameters()
    ],

    requestBody: {
        description: 'data required to create the invoice',
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        signature: {
                            type: 'array',
                            items: {
                                type: 'array',
                                items: {
                                    type: 'number'
                                }
                            }
                        }
                    },
                    required: [
                        'signature'
                    ],
                    example: {
                        'signature': [ [ 44.046875,27.5,46.046875,35.5,47.046875,38.5,48.046875,43.5,49.046875,46.5,50.046875,51.5,52.046875,54.5,53.046875,57.5,55.046875,61.5 ],[ 26.046875,47.5,33.046875,40.5,36.046875,38.5,39.046875,36.5,43.046875,33.5,47.046875,31.5,52.046875,29.5,56.046875,27.5,61.046875,25.5,64.046875,23.5 ],[ 58.046875,46.5,68.046875,45.5,71.046875,44.5,74.046875,43.5,77.046875,41.5,80.046875,38.5,79.046875,35.5,76.046875,33.5,73.046875,32.5,69.046875,33.5,66.046875,36.5,64.046875,40.5,62.046875,43.5,62.046875,48.5,64.046875,51.5,68.046875,51.5,72.046875,50.5,76.046875,50.5,79.046875,49.5,82.046875,47.5,86.046875,44.5 ],[ 102.046875,26.5,93.046875,27.5,89.046875,28.5,85.046875,31.5,83.046875,34.5,87.046875,36.5,93.046875,36.5,99.046875,36.5,103.046875,36.5,104.046875,39.5,104.046875,43.5,101.046875,44.5,96.046875,46.5,93.046875,47.5,90.046875,48.5,86.046875,51.5 ],[ 118.046875,19.5,120.046875,28.5,121.046875,31.5,122.046875,35.5,125.046875,52.5 ],[ 110.046875,33.5,119.046875,30.5,122.046875,29.5,125.046875,28.5,128.046875,27.5,133.046875,24.5,137.046875,23.5 ] ]
                    }
                }
            }
        }
    },

    responses: {
        200: {
            description: 'an invoice as a pdf',
            content: {
                // 'application/pdf': {
                //     schema: {
                //         type: 'string',
                //         format: 'binary'
                //     }
                // },
                // 'image/jpeg': {
                //     schema: {
                //         type: 'string',
                //         // format: 'binary'
                //     }
                // },
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