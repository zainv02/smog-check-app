import { Field, InputField } from '$components/Form';
import { A } from '@solidjs/router';
import { Component, JSX } from 'solid-js';

const UserInfo: Component = () => {

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
                <h2 class='title'>User Information</h2>
            
                <form class='form w-full' onSubmit={handleSubmit} >
                
                    <InputField name='plate' label='License Plate:' type='text' attr={{ required: true }} />
                    <InputField name='state' label='State:' type='text' attr={{ required: true }} />
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

export default UserInfo;