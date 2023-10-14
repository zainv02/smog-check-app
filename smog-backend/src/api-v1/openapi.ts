import { OpenAPIV3 } from 'openapi-types';

const apiDoc: OpenAPIV3.Document = {
    openapi: '3.0.3',
    info: {
        title: 'smog api',
        version: '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:4000/api-v1',
            description: 'development url'
        }
    ],

    components: {
        schemas: {
            VehicleInfo: {
                type: 'object',
                properties: {
                    vin: {
                        type: 'string'
                    },
                    year: {
                        type: 'number'
                    },
                    make: {
                        type: 'string'
                    },
                    model: {
                        type: 'string'
                    },
                    plate: {
                        type: 'string'
                    },
                    mileage: {
                        type: 'number'
                    },
                },
                required: [ 
                    'vin', 
                    'year', 
                    'make',
                    'model',
                    'plate',
                    'mileage' 
                ],
                additionalProperties: false
            }
        }
    },
    paths: {}
};
  
export default apiDoc;