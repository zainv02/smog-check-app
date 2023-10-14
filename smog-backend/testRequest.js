import axios from 'axios';

async function getVinData(licensePlate, state) {

    const url = new URL(
        'https://platetovin.com/api/convert'
    );
    
    const headers = {
        'Authorization': 'THjzMgUEzJxG4eJ',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    let body = {
        'state': state,
        'plate': licensePlate
    };

    const result = await axios({
        url,
        method: 'post',
        headers,
        data: body
    });

    console.log(result.data);

    if (result.data[ 'success' ]) {

        return result.data[ 'vin' ];
    
    }

    return undefined;

}

async function getVehicleData(vin) {

    const url = new URL(
        'https://platetovin.com/api/vin-lookup'
    );

    const headers = {
        'Authorization': 'THjzMgUEzJxG4eJ',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    let body = {
        'vin': vin
    };

    const result = await axios({
        url,
        method: 'post',
        headers,
        data: body
    });

    console.log(result.data);

    if (result.data[ 'success' ]) {

        return result.data[ 'data' ];
    
    }

    return undefined;

}


async function main() {

    
    

    // const vinData = await getVinData('6LEE230', 'ca');

    // if (!vinData) {

    //     console.log('failed to get vin');
    //     return;
    
    // }

    // const vehicleData = await getVehicleData(vinData[ 'vin' ]);

    // if (!vinData) {

    //     console.log('failed to get vehicle data');
    //     return;
    
    // }

    // console.log(vehicleData);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const result = await axios({
        url: 'http://localhost:4000/api/vehicle-info',
        method: 'post',
        headers,
        data: {
            plate: '6LEE230',
            state: 'ca',
        },
    });

    console.log('api test:', result.data);

}

main();