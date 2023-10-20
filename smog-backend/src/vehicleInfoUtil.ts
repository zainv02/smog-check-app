import axios from 'axios';

export async function getVinData(plate: string, state: string) {

    const url = new URL(
        'https://platetovin.com/api/convert'
    );
    
    const headers = {
        'Authorization': 'THjzMgUEzJxG4eJ',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    const body = {
        'state': state,
        'plate': plate
    };

    const result = await axios({
        url: url.toString(),
        method: 'post',
        headers,
        data: body
    });

    // console.log(result.data);

    if (result.data[ 'success' ]) {

        return result.data[ 'vin' ];
    
    }

    return undefined;

}

export async function getVehicleData(vin: string) {

    const url = new URL(
        'https://platetovin.com/api/vin-lookup'
    );

    const headers = {
        'Authorization': 'THjzMgUEzJxG4eJ',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const body = {
        'vin': vin
    };

    const result = await axios({
        url: url.toString(),
        method: 'post',
        headers,
        data: body
    });

    // console.log(result.data);

    if (result.data[ 'success' ]) {

        return result.data[ 'data' ];
    
    }

    return undefined;

}