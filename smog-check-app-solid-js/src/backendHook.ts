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

export async function getInvoice(data: InvoiceData) {

    if (!data) {

        console.warn('getInvoice needs data!');
        return;
    
    }

    try {

        const response = await axios.post(
            createServerUrl('/create-invoice'), 
            data, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
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