import { Operation } from 'express-openapi';
import cors from 'cors';
import { query } from '../../utils/databaseUtil';

export const GET: Operation = [
    cors(),
    async (_req, res) => {

        try {
            
            const result = await query({
                text: 'SELECT * FROM "sources"'
            });

            if (!result) {

                throw new Error('query failed');
            
            }

            res.status(200).send({ rows: result.rows });

        } catch (error) {

            res.status(500).send(`failed to get sources - ${error}`);
        
        }
    
    }
];

GET.apiDoc = {
    description: 'get possible sources for learning about the company',
    responses: {
        200: {
            description: 'possible sources for learning about the company',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            rows: {
                                type: 'array',
                                items: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                }
            }
        },
        default: {
            $ref: '#/components/responses/Error'
        }
    }

};