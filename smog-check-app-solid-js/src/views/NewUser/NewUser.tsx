import { A } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';

const NewUser: Component = () => {

    const [ licensePlate, setLicensePlate ] = createSignal('');
    const [ name, setName ] = createSignal('');

    const handleLicensePlateChange = (e) => {

        setLicensePlate(e.target.value);
    
    };

    const handleNameChange = (e) => {

        setName(e.target.value);
    
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        // You can handle the form submission here (e.g., send data to the server).
        // For now, let's log the values to the console.
        console.log('License Plate:', licensePlate());
        console.log('Name:', name());
    
    };

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
                <div class='field'>
                    <label for='name'>Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={name()}
                        onChange={handleNameChange}
                    />
                </div>
                <div class='buttons'>
                    <A href='/' class='button'>Back</A>
                    <button type='submit' class='button primary'>Submit</button>
                </div>
            </form>
        </section>
    );

};

export default NewUser;
