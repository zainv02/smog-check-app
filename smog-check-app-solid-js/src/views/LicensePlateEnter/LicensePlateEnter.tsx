import { Component, JSX, createSignal } from 'solid-js';

import { ButtonStyles, LinkButton, SubmitButton } from '$components/Button';
import { Form, InputField, SelectField } from '$components/Form';
import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';
import { states } from '$src/data/states';
import { getFormFields } from '$src/utils/formUtils';

// const api = new BackendAPI();

const LicensePlateEnter: Component = () => {

    let targetUrl: URL;

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = (e) => {

        e.preventDefault();

        const fields = getFormFields(e.currentTarget);

        console.log('fields:', fields);

        targetUrl = new URL(`${window.location.origin}/user-info`);

        targetUrl.search = new URLSearchParams(fields as Record<string, string>).toString();

        setTimeout(() => {

            // setFormSubmitted(true);
            window.location.href = targetUrl.toString();
        
        }, 2000);
        // setFormSubmitted(true);
    
    };

    return <>
        <Section>
            <Panel>
                <Title>License Plate Info</Title>
            
                <Form onSubmit={handleSubmit}>
                    <InputField 
                        name='plate' label='License Plate:' type='text' 
                        inputTransformer={(char) => {

                            if (!char.match(/[A-Za-z0-9 \\-_]+/g)) {

                                return false;
                            
                            }

                            return char.toUpperCase();
                        
                        }}
                        attr={{ autoCapitalize: 'characters', pattern: '^[A-Za-z0-9]{7}', required: true, maxLength: 7 }} 
                    />
                    <SelectField name='state' label='State:' attr={{ required: true }} options={Object.entries(states)} emptyOption={true} />
                    {/* <InputField name='name' label='Name:' type='text' attr={{ required: true }} /> */}

                    <div class='flex w-full flex-row items-center justify-between'>
                        <LinkButton href='/'>Back</LinkButton>
                        <SubmitButton buttonStyle={ButtonStyles.PRIMARY}>Submit</SubmitButton>
                    </div>
                </Form>
                
            </Panel>
        </Section>
    </>;

};

export default LicensePlateEnter;
