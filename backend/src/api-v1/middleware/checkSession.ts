import { RequestHandler } from 'express';
import { userSessionManager } from '../..';
import { RequestError } from '../requestError';
import { OpenAPIV3 } from 'openapi-types';

interface CheckSessionOptions {
    noError?: boolean
}

export const checkSession: (opts?: CheckSessionOptions) => RequestHandler = (opts) => {

    return async (req, res, next) => {

        try {
    
            const session = userSessionManager.getSession(req.query[ 'session' ] as string);
    
            if (!session) {
    
                throw new RequestError(401, 'failed to get session');
            
            }
            
            res.locals.session = session;
            next();
        
        } catch (e) {
    
            if (opts?.noError) {

                next();
            
            } else {

                const error = e as RequestError;
            
                res.status(error.status).send(error.message);
            
            }
    
        }
    
    };

};

interface SessionParametersOptions {
    optional?: boolean
}

export const sessionParameters: (opts?: SessionParametersOptions) => NonNullable<OpenAPIV3.OperationObject['parameters']> = (opts) => {

    return [
        {
            required: opts?.optional || true,
            in: 'query',
            name: 'session',
            schema: {
                type: 'string'
            }
        }
    ];

};