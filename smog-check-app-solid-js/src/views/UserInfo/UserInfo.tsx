import { Component, JSX } from 'solid-js';

import { LinkButton, SubmitButton, ButtonStyles } from '$components/Button';
import { Form, InputField } from '$components/Form';
import { Title } from '$components/Header';
import { Section, Panel, Columns } from '$components/Layout';
import { getFormFields } from '$src/utils/formUtils';

/**
 * name     date
 * address  phone
 * city zip?
 * source
 * 
 * and also show car info (uneditable)
 * 
 * lastly:
 * signature   $estimate
 * 
 * @returns 
 */
const UserInfo: Component = () => {

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = (e) => {

        e.preventDefault();

        const fields = getFormFields(e.currentTarget);

        for (const [ name, value ] of Object.entries(fields)) {

            console.log(name, ':', value);
        
        }
    
    };
    

    return <>
        <Section>
            <Panel>
                <Title>Customer Info</Title>
            
                <Form onSubmit={handleSubmit}>
                    <Columns>
                        <InputField name='name' label='Name:' type='text' attr={{ required: true }} />
                        <InputField name='date' label='Date:' type='date' attr={{ required: true }} />
                    </Columns>
                    <Columns>
                        <InputField name='address' label='Address:' type='text' attr={{ required: true }} />
                        <InputField name='phone' label='Phone:' type='tel' attr={{ required: true }} />
                    </Columns>
                    <InputField name='city' label='City:' type='text' attr={{ required: true }} />
                    <InputField name='source' label='Source:' type='text' attr={{ required: true }} />

                    <div class='flex flex-row items-center justify-between'>
                        <LinkButton href='/license-info'>Back</LinkButton>
                        <SubmitButton buttonStyle={ButtonStyles.PRIMARY}>Confirm</SubmitButton>
                    </div>
                </Form>
            </Panel>
        </Section>
    </>;

};

export default UserInfo;