import { Operation } from 'express-openapi';

export const GET: Operation = [
    (_req, res) => {

        const req = _req as typeof _req & { apiDoc: object };

        res.status(200).json(req.apiDoc);
    
    }
];

GET.apiDoc = {
    description: 'gets the api doc',

    responses: {
        200: {
            description: 'the api doc',
            content: {
                'application/json': {
                    schema: {
                        type: 'object'
                    }
                }
            }
        }
    }
};