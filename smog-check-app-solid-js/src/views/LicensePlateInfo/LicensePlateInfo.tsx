import { useNavigate } from '@solidjs/router';
import { Component, JSX, createSignal } from 'solid-js';

import { ButtonStyles, LinkButton, SubmitButton } from '$components/Button';
import { Form, InputField, SelectField } from '$components/Form';
import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';
import { LoadingDisplay } from '$components/LoadingDisplay';
import * as API from '$src/backendHook';
// import { setGlobalValue } from '$src/data/global';
import { states } from '$src/data/states';
import { getFormFields } from '$src/utils/formUtils';

// const api = new BackendAPI();

const LicensePlateInfo: Component = () => {

    // let targetUrl: URL;

    const [ submitting, setSubmitting ] = createSignal(false);
    const navigate = useNavigate();

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        if (submitting()) {

            return;
        
        }

        setSubmitting(true);

        const fields = getFormFields(e.currentTarget) as Record<string, string>;

        console.log('fields:', fields);

        // setSearchParams(fields as Record<string, string>, { replace: true });

        const result = await API.getUserInfo({
            plate: fields.plate,
            state: fields.state
        });

        if (result) {

            console.log('success with result', result);
            console.log('going to user-info page');
            
            // setSearchParams(result as Record<string, string>, { replace: true });

            // setGlobalValue('userInfo', result);

            navigate('/user-info' + `?${new URLSearchParams(result)}`);
        
        }

        

        // setTimeout(() => {

        //     // setFormSubmitted(true);
        //     window.location.href = url.toString();
        //     navigate('/user-info', {});
            
        
        // }, 2000);
        // // setFormSubmitted(true);

        setSubmitting(false);
    
    };

    return <>
        <Section>
            <Panel class='relative'>
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
