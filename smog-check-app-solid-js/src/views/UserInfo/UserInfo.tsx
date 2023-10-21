import { useNavigate, useSearchParams } from '@solidjs/router';
import { Component, JSX, createSignal } from 'solid-js';

import { SubmitButton, ButtonStyles, LinkButton } from '$components/Button';
import { Divider, FieldInputWidthMode, FieldLabelMode, Form, InputField } from '$components/Form';
import { Title } from '$components/Header';
import { Section, Panel, Columns } from '$components/Layout';
import { LoadingDisplay } from '$components/LoadingDisplay';
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


    const [ searchParams, _setSearchParams ] = useSearchParams();
    const navigate = useNavigate();

    const [ submitting, setSubmitting ] = createSignal(false);

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        if (submitting()) {

            return;
        
        }

        setSubmitting(true);

        const fields = getFormFields(e.currentTarget);

        const customerInfo = Object.assign({ ...searchParams }, fields);

        console.log(customerInfo);

        navigate('/sign' + `?${new URLSearchParams(customerInfo)}`);
    
    };

    return <>
        <Section>
            <Panel class='relative'>
                <Title>Customer Info</Title>
            
                <Form onSubmit={handleSubmit}>
                    <Columns>
                        <InputField name='name' label='Name:' labelMode={FieldLabelMode.TOP} type='text' value={searchParams[ 'name' ]} required={true} />
                        <InputField name='date' label='Date:' labelMode={FieldLabelMode.TOP} type='date' value={new Date().toISOString().slice(0, 10)} required={true} />
                        <InputField name='phone' label='Phone:' labelMode={FieldLabelMode.TOP} type='tel' value={searchParams[ 'phone' ]} required={true} />
                    </Columns>
                    <Columns>
                        <InputField name='address' label='Address:' labelMode={FieldLabelMode.TOP} type='text' value={searchParams[ 'address' ]} required={true} />
                        <InputField name='city' label='City:' labelMode={FieldLabelMode.TOP} type='text' value={searchParams[ 'city' ]} required={true} />
                    </Columns>
                    <InputField name='source' label='Source:' inputWidthMode={FieldInputWidthMode.FILL} type='text' value={searchParams[ 'source' ]} required={false} />
                    <Divider />
                    <Title>Car Info</Title>
                    <Columns class='[&>*>label]:text-sm'>
                        <div>
                            <label>Year</label><Divider /><p>{searchParams[ 'year' ]}</p>
                        </div>
                        <div>
                            <label>Make</label><Divider /><p>{searchParams[ 'make' ]}</p>
                        </div>
                        <div>
                            <label>Model</label><Divider /><p>{searchParams[ 'model' ]}</p>
                        </div>
                        <div>   
                            <label>Plate</label><Divider /><p>{searchParams[ 'plate' ]}</p>
                        </div>
                        <div>
                            <label>Mileage</label><Divider /><p>{searchParams[ 'mileage' ]}</p>
                        </div>
                    </Columns>
                    
                    <div class='flex flex-row items-center justify-between'>
                        <LinkButton href='/plate-info' disabled={submitting()}>Back</LinkButton>
                        <SubmitButton buttonStyle={ButtonStyles.PRIMARY} disabled={submitting()}>Confirm</SubmitButton>
                    </div>
                </Form>

                {submitting() && <LoadingDisplay />}
            </Panel>
        </Section>
    </>;

};

export default UserInfo;