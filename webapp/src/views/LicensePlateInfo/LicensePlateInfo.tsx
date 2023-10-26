import { useNavigate } from '@solidjs/router';
import { Component, JSX, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';

import { ButtonStyles, LinkButton, SubmitButton } from '$components/Button';
import { Form, InputField, SelectField } from '$components/Form';
import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';
import { LoadingDisplay } from '$components/LoadingDisplay';
import { createSession } from '$src/backendHook';
import { states } from '$src/data/states';
import { getFormFields } from '$src/utils/formUtils';


const LicensePlateInfo: Component = () => {

    const [ submitError, setSubmitError ] = createSignal('');

    const [ submitting, setSubmitting ] = createSignal(false);
    const navigate = useNavigate();

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        if (submitting()) {

            return;
        
        }

        setSubmitting(true);

        const fields = getFormFields(e.currentTarget) as Record<string, string>;

        const result = await createSession({
            plate: fields.plate,
            state: fields.state
        });

        if (result) {

            console.log('success with result', result);
            console.log('going to user-info page');

            navigate('/user-info' + `?${new URLSearchParams({ session: result })}`);
        
        } else {

            console.error('failed to create session');
            setSubmitError('Couldn\'t find the requested vehicle information. Check that the license plate and state are correct.');

        }

        setSubmitting(false);
    
    };

    return <>
        <Section>
            <Panel class='relative w-96'>
                <Title>License Plate Info</Title>
                <Form onSubmit={handleSubmit}>
                    <p class={twMerge('text-red-500 w-full', submitError().length === 0 && 'hidden')}>{submitError()}</p>
                    <InputField 
                        name='plate' label='License Plate:' type='text' 
                        inputTransformer={(char) => {

                            if (!char.match(/[A-Za-z0-9 \\-_]+/g)) {

                                return false;
                            
                            }

                            return char.toUpperCase();
                        
                        }}
                        autoCapitalize='characters'
                        pattern='^[A-Za-z0-9]{7}'
                        required={true}
                        maxLength={7} 
                    />
                    <SelectField name='state' label='State:' required={true} options={Object.entries(states)} emptyOption={true} />
                    {/* <InputField name='name' label='Name:' type='text' attr={{ required: true }} /> */}

                    <div class='flex w-full flex-row items-center justify-between'>
                        <LinkButton href='/' disabled={submitting()}>Back</LinkButton>
                        <SubmitButton buttonStyle={ButtonStyles.PRIMARY} disabled={submitting()}>Submit</SubmitButton>
                    </div>
                </Form>
                
                {submitting() && <LoadingDisplay />}

            </Panel>
        </Section>
    </>;

};

export default LicensePlateInfo;
