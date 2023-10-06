import { Component, JSX, createSignal } from 'solid-js';
// import '../FormStyle.css';
import BackendAPI from '$src/BackendAPI.ts';
import { A } from '@solidjs/router';

const api = new BackendAPI();

const LicensePlateEnter: Component = () => {

    const [ licensePlate, setLicensePlate ] = createSignal('');
    const [ userInfo, setUserInfo ] = createSignal(null);
    const [ carInfo, setCarInfo ] = createSignal(null);

    const handleLicensePlateChange = (e) => {

        e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
        e.target.value = e.target.value.toUpperCase();
        setLicensePlate(e.target.value);
    
    };


    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();
        // You can handle the form submission here (e.g., send data to the server).
        // For now, let's log the values to the console.
        console.log('License Plate:', licensePlate());

   
        const userData = api.getUserInfo(licensePlate());
        const carData = api.getCarInfo(licensePlate());

        setUserInfo(userData);
        setCarInfo(carData);
    
    };

    // const { validate, formSubmit, errors } = useForm({
    //     errorClass: 'error-input'
    // });
    // const [ fields, setFields ] = createStore();

    return (
        <section class='section'>
            <h2 class='title'>Enter Your Information</h2>
            <form onSubmit={handleSubmit} class='form'>
                <div class='field'>
                    <label for='licensePlate'>License Plate Number:</label>
                    <input
                        type='text'
                        id='licensePlate'
                        name='licensePlate'
                        value={licensePlate()}
                        onChange={handleLicensePlateChange}
                    />
                </div>
                
                <div class='buttons'>
                    <A href='/' class='button'>Back</A><button type='submit' class='button primary'>Submit</button>
                </div>
            </form>
            
        </section>
    );

};

export default LicensePlateEnter;
