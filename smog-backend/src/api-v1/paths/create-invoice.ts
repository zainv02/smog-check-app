import { Operation } from 'express-openapi';
import fs from 'node:fs';
import path from 'node:path';
import { jsPDF } from 'jspdf';

/**
 * 
 * @param data 
 * @returns {string} path to the pdf
 */
function createInvoice(data: Record<string, string>): string {

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [ 8.5, 11 ]
    });
    
    const dir = path.resolve('../../temp');
    
    if (!fs.existsSync(dir)) {
    
        fs.mkdirSync(dir);
        
    }

    const pdfPath = dir + '/' + 'invoice.pdf';

    const fontSize = 16;

    doc.setFontSize(fontSize);

    doc.text(`Name: ${data[ 'name' ]}`, 0, 0);
    doc.text(`Date: ${data[ 'date' ]}`, 0, 0);
    doc.text(`Name: ${data[ 'name' ]}`, 0, 0);
    doc.text(`Name: ${data[ 'name' ]}`, 0, 0);
    doc.text(`Name: ${data[ 'name' ]}`, 0, 0);

    doc.save(pdfPath);

    return pdfPath;

}


// consider making this pull data from database instead?

export const POST: Operation = [

    async (req, res) => {

        res.status(400).send('error');

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
                                }
                            },
                            required: [
                                'date'
                            ]
                        }
                    ],
                    additionalProperties: false
                }
            }
        }
    },

    responses: {
        200: {
            description: 'an invoice as a pdf',
            content: {
                'application/pdf': {

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