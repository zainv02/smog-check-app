import axios from 'axios';

const backendURL = 'http://localhost:4000/';

function createServerUrl(path: string) {

    if (!path || path.length === 0) {

        return '/';
    
    }

    if (path[ 0 ] !== '/') {

        path = '/' + path;
    
    }

    const url = new URL(backendURL);

    url.pathname = 'api-v1' + path;

    return url.toString();

}

interface UserInfoParams {
    plate: string,
    state: string
}

export async function createSession(params: UserInfoParams) {

    if (!params) {

        console.warn('createSession needs params!');
        return;
    
    }

    try {

        const response = await axios.post(createServerUrl('/create-session'), {
            plate: params.plate,
            state: params.state
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
            }
        });

        if (response.status !== 200) {

            throw new Error('bad status');
        
        }

        return response.data;
    
    } catch (error) {
        
        console.error('createSession error', error);

    }

}

export async function checkSession(params: { session: string }) {

    try {

        console.log('checking session', params[ 'session' ]);
        const response = await axios.get(createServerUrl('/check-session'), {
            params,
            headers: {
            // 'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status !== 200) {

            throw new Error(`bad status - ${response.data}`);
    
        }

        console.log('session found and valid');
        return response.data;

    } catch (error) {

        console.error('failed to validate session', error);

    }

}

export async function getUserInfo(params: {session: string}) {

    if (!params) {

        console.warn('getUserInfo needs params!');
        return;
    
    }

    try {

        const response = await axios.get(createServerUrl('/get-user-info'), {
            params,
            headers: {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // console.log('getUserInfo response', response);

        if (response.status !== 200) {

            throw new Error('bad status');
        
        }

        return response.data;
    
    } catch (error) {
        
        console.error('getUserInfo error', error);

    }

}

export async function updateUserInfo(params: {session: string}, body: object) {

    if (!params) {

        console.warn('getUserInfo needs params!');
        return;
    
    }

    if (!body) {

        console.warn('getUserInfo needs body!');
        return;
    
    }

    try {

        const response = await axios.post(createServerUrl('/update-user-info'), body, {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // console.log('getUserInfo response', response);

        if (response.status !== 200) {

            throw new Error('bad status');
        
        }

        return response.data;
    
    } catch (error) {
        
        console.error('getUserInfo error', error);

    }

}

export interface GetEstimateParams {
    session?: string,
    year?: number | string,
}

export async function getEstimate(params: GetEstimateParams) {

    if (!params) {

        console.warn('getEstimate needs params!');
        return;
    
    }

    try {

        const response = await axios.get(createServerUrl('/get-estimate'), {
            params,
            headers: {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status !== 200) {

            throw new Error(`bad status [${response.data}]`);
        
        }

        return response.data;
    
    } catch (error) {
        
        console.error('getEstimate error', error);

    }

}

export interface CreateInvoiceData {
    signature: number[][]
}

export async function createInvoice(params: {session: string}, data: CreateInvoiceData) {

    try {

        const response = await axios.post(
            createServerUrl('/create-invoice'), 
            data, 
            {
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                }
            }
        );

        if (response.status !== 200) {

            throw new Error(`bad status ${response.data}`);
        
        }

        return response.data;
        
    } catch (error) {

        console.error('createInvoice error', error);
    
    }

}

export interface InvoiceData {
    name?: string,
    date?: string,
    address?: string,
    phone?: string,
    city?: string,
    source?: string,
    year?: number | string,
    make?: string,
    model?: string,
    plate?: string,
    mileage?: number | string,
    vin?: string,
    estimate?: number | string,
    signature?: number[][]
}

export async function getInvoice(params: {session: string}) {

    if (!params) {

        console.warn('getInvoice needs params!');
        return;
    
    }

    try {

        const response = await axios.get(
            createServerUrl('/get-invoice'),
            {
                params,
                headers: {
                    // 'Content-Type': 'application/json',
                    'Accept': 'image/jpeg'
                }
            }
        );

        if (response.status !== 200) {

            throw new Error('bad status');
        
        }

        return response.data;
        
    } catch (error) {

        console.error('getInvoice error', error);
    
    }

}

export async function sendInvoice(params: {session: string}, data: {email: string}) {

    if (!params) {

        console.warn('sendInvoice needs params!');
        return;
    
    }

    try {

        const response = await axios.post(
            createServerUrl('/send-invoice'),
            data,
            {
                params,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Accept': 'image/jpeg'
                }
            }
        );

        if (response.status !== 200) {

            throw new Error('bad status');
        
        }

        return response.data;
        
    } catch (error) {

        console.error('sendInvoice error', error);
    
    }

}


export async function getSources(): Promise<{ rows: object[]; }> {

    try {

        const response = await axios.get(
            createServerUrl('/get-sources'),
            {
                headers: {
                    // 'Content-Type': 'application/json',
                    // 'Accept': 'image/jpeg'
                }
            }
        );

        if (response.status !== 200) {

            throw new Error('bad status');
        
        }

        return response.data;
        
    } catch (error) {

        console.error('getSources error', error);
    
    }

}