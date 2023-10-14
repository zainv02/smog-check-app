const backendURL = 'http://127.0.0.1:4000';

class BackendAPI
{

    async getUserInfo(licensePlate) {

        try {

            const response = await fetch(backendURL + '/user?plate=' + licensePlate);
      
            if (!response.ok) {

                console.log('Testing getuser info');
                throw new Error('Network response failed');
            
            }
      
            const data = await response.json(); // Parse the JSON response
            console.log(data); // Log the parsed data
      
            return data; // Return the parsed data
        
        } catch (error) {

            console.error('Error:', error);
            return {}; // Return an empty object or handle the error as needed
        
        }
    
    }

    async getCarInfo(licensePlate) {

        try {

            const response = await fetch(backendURL + '/car?plate=' + licensePlate);
      
            if (!response.ok) {

                console.log('Testing getuser info');
                throw new Error('Network response failed');
            
            }
      
            const data = await response.json(); // Parse the JSON response
            console.log(data); // Log the parsed data
      
            return data; // Return the parsed data
        
        } catch (error) {

            console.error('Error:', error);
            return {}; // Return an empty object or handle the error as needed
        
        }
    
    }

}

export default BackendAPI;