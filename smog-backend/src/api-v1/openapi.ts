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
                        oneOf: [
                            {
                                type: 'string'
                            },
                            {
                                type: 'number'
                            }
                        ]
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
                        oneOf: [
                            {
                                type: 'string'
                            },
                            {
                                type: 'number'
                            }
                        ]
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
                example: {
                    'vin':'JF1GE7E68AH505850',
                    'year':2010,
                    'make':'Subaru',
                    'model':'Impreza',
                    'plate':'6LEE230',
                    'mileage':21
                }
            },
            UserInfo: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    address: {
                        type: 'string'
                    },
                    city: {
                        type: 'string'
                    },
                    phone: {
                        type: 'string'
                    },
                    source: {
                        type: 'string'
                    },
                },
                example: {
                    // 'id': 'JO1231',
                    'name':'John',
                    'address':'1234 Cool Street',
                    'city':'San Limon',
                    'phone':'1234567890',
                    'source':'Source',
                }
            }
        }
    },
    paths: {}
};
  
export default apiDoc;