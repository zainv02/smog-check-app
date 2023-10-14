import { Component, JSX } from 'solid-js';
// import '../FormStyle.css';
// import BackendAPI from '$src/BackendAPI.ts';
import { A } from '@solidjs/router';
import { InputField, SelectField } from '$components/Form';
import { states } from '$src/data/states';

// const api = new BackendAPI();

const LicensePlateEnter: Component = () => {

    // const handleLicensePlateChange = (e) => {

    //     // e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
    //     // e.target.value = e.target.value.toUpperCase();
    //     // setLicensePlate(e.target.value);
    
    // };

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = (e) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        for (const [ name, value ] of formData) {

            console.log(name, ':', value);
        
        }
    
    };
    

    return <>
        <section class='section h-screen'>
            <div class='panel mt-16'>
                <h2 class='title'>License Plate Info</h2>
            
                <form class='form w-full' onSubmit={handleSubmit} >
                
                    <InputField 
                        name='plate' label='License Plate:' type='text' 
                        inputTransformer={(char) => {

                            return char.toUpperCase();
                        
                        }}
                        attr={{ autoCapitalize: 'characters', pattern: '^[A-Za-z0-9]{7}', required: true, maxLength: 7 }} 
                    />
                    <SelectField name='state' label='State:' attr={{ required: true }} options={Object.entries(states)} emptyOption={true} />
                    <InputField name='name' label='Name:' type='text' attr={{ required: true }} />

                    <div class='buttons'>
                        <A href='/' class='button'>Back</A>
                        <input type='submit' class='button primary'>Submit</input>
                    </div>
                
                </form>
            </div>

        </section>
    </>;

};

export default LicensePlateEnter;
