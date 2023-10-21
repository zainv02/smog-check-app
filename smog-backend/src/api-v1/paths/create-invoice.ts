import { Operation } from 'express-openapi';
import fs from 'node:fs';
import path from 'node:path';
// import { jsPDF } from 'jspdf';
import { EXAMPLE_DATA, createInvoice } from '../../invoiceUtil';
import * as pdfjsLib from 'pdfjs-dist';

import { createCanvas } from 'canvas';

// consider making this pull data from database instead?

export const POST: Operation = [

    async (req, res) => {

        console.log('create invoice request', req.body);
        // res.status(201).send('good');
        // return;
        try {

            console.log('current dir', path.resolve('.'));

            const dir = path.resolve(__dirname + '/../../temp');
    
            if (!fs.existsSync(dir)) {
    
                fs.mkdirSync(dir);
        
            }

            const pdfPath = dir + '/' + 'invoice.pdf';

            const invoiceData = req.body;

            console.log('generating pdf');

            const doc = createInvoice(invoiceData);

            console.log('generated pdf, saving');

            doc.save(pdfPath);

            console.log('saved to', pdfPath);

            if (req.headers.accept === 'application.pdf') {

                res.status(200).sendFile(pdfPath);
            
            } else {

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

                res.status(200).send(imageDataUrl);

            }
        
        } catch (error) {

            res.status(400).send(`POST request error - ${error}`);
            console.error('create invoice request error', error);
        
        }

    }

];


POST.apiDoc = {
    description: 'create an invoice from given data',

    requestBody: {
        description: 'data required to create the invoice',
        required: true,
        content: {
            'application/json': {
                schema: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/VehicleInfo'
                        },
                        {
                            $ref: '#/components/schemas/UserInfo'
                        },
                        {
                            type: 'object',
                            properties: {
                                date: {
                                    type: 'string'
                                },
                                estimate: {
                                    type: 'number'
                                },
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
                                'date',
                                'estimate',
                                'signature'
                            ],
                            example: {
                                'date': '12-29-2023',
                                'estimate': 150,
                                'signature': [ [ 44.046875,27.5,46.046875,35.5,47.046875,38.5,48.046875,43.5,49.046875,46.5,50.046875,51.5,52.046875,54.5,53.046875,57.5,55.046875,61.5 ],[ 26.046875,47.5,33.046875,40.5,36.046875,38.5,39.046875,36.5,43.046875,33.5,47.046875,31.5,52.046875,29.5,56.046875,27.5,61.046875,25.5,64.046875,23.5 ],[ 58.046875,46.5,68.046875,45.5,71.046875,44.5,74.046875,43.5,77.046875,41.5,80.046875,38.5,79.046875,35.5,76.046875,33.5,73.046875,32.5,69.046875,33.5,66.046875,36.5,64.046875,40.5,62.046875,43.5,62.046875,48.5,64.046875,51.5,68.046875,51.5,72.046875,50.5,76.046875,50.5,79.046875,49.5,82.046875,47.5,86.046875,44.5 ],[ 102.046875,26.5,93.046875,27.5,89.046875,28.5,85.046875,31.5,83.046875,34.5,87.046875,36.5,93.046875,36.5,99.046875,36.5,103.046875,36.5,104.046875,39.5,104.046875,43.5,101.046875,44.5,96.046875,46.5,93.046875,47.5,90.046875,48.5,86.046875,51.5 ],[ 118.046875,19.5,120.046875,28.5,121.046875,31.5,122.046875,35.5,125.046875,52.5 ],[ 110.046875,33.5,119.046875,30.5,122.046875,29.5,125.046875,28.5,128.046875,27.5,133.046875,24.5,137.046875,23.5 ] ]
                            }
                        },
                    ],
                    example: EXAMPLE_DATA,
                    additionalProperties: true
                }
            }
        }
    },

    responses: {
        200: {
            description: 'an invoice as a pdf',
            content: {
                'application/pdf': {
                    schema: {
                        type: 'string',
                        format: 'binary'
                    }
                },
                'image/jpeg': {
                    schema: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        },
        201: {
            description: 'testing for error',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string'
                    }
                }
            }
        },
        default: {
            description: 'An error occurred',
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