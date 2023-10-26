import { useNavigate, useSearchParams } from '@solidjs/router';
import { Component, JSX, createSignal, onMount } from 'solid-js';

import { SubmitButton, ButtonStyles, LinkButton } from '$components/Button';
import { Divider, FieldInputWidthMode, FieldLabelMode, Form, InputField } from '$components/Form';
import { Title } from '$components/Header';
import { Section, Panel, Columns } from '$components/Layout';
import { LoadingDisplay } from '$components/LoadingDisplay';
import { getUserInfo, updateUserInfo } from '$src/backendHook';
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

    let session: string;

    const [ loading, setLoading ] = createSignal<boolean>(false);
    const [ data, setData ] = createSignal({});
    const [ error, setError ] = createSignal('');

    onMount(async () => {

        // window.addEventListener('beforeunload', () => {
            
        // });

        setLoading(true);

        session = searchParams[ 'session' ];

        const result = await getUserInfo({ session });

        if (!result) {

            console.error('failed to get user info');
            setError('Failed to get information. The session could have expired.');
            setLoading(false);
            return;
        
        }

        setData(result);
    
        setLoading(false);

    });

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        if (submitting()) {

            return;
        
        }

        setSubmitting(true);

        const fields = getFormFields(e.currentTarget);

        console.log('updating user info with', fields);

        // submit fields to update customer data
        const result = await updateUserInfo({ session }, fields);

        if (!result) {

            console.error('failed to update user info');
            setSubmitting(false);
            return;
        
        }

        console.log('updated info');

        // const customerInfo = Object.assign({ ...searchParams }, fields);

        // console.log(customerInfo);

        // navigate('/sign' + `?${new URLSearchParams(customerInfo)}`);

        navigate('/sign' + `?${new URLSearchParams({ session })}`);
    
    };

    return <>
        <Section>
            <Panel class='relative'>
                <Title>Customer Info</Title>
            
                <Form onSubmit={handleSubmit}>
                    <Columns>
                        <InputField name='name' label='Name:' labelMode={FieldLabelMode.TOP} type='text' value={data()[ 'name' ]} required={true} />
                        <InputField name='date' label='Date:' labelMode={FieldLabelMode.TOP} type='date' value={new Date().toISOString().slice(0, 10)} required={true} />
                        <InputField name='phone' label='Phone:' labelMode={FieldLabelMode.TOP} type='tel' value={data()[ 'phone' ]} required={true} />
                    </Columns>
                    <Columns>
                        <InputField name='address' label='Address:' labelMode={FieldLabelMode.TOP} type='text' value={data()[ 'address' ]} required={true} />
                        <InputField name='city' label='City:' labelMode={FieldLabelMode.TOP} type='text' value={data()[ 'city' ]} required={true} />
                    </Columns>
                    <InputField name='source' label='Source:' inputWidthMode={FieldInputWidthMode.FILL} type='text' value={data()[ 'source' ]} required={false} />
                    <Divider />
                    <Title>Vehicle Info</Title>
                    <Columns class='[&>*>label]:text-sm'>
                        <div>
                            <label>Year</label><Divider /><p>{data()[ 'year' ]}</p>
                        </div>
                        <div>
                            <label>Make</label><Divider /><p>{data()[ 'make' ]}</p>
                        </div>
                        <div>
                            <label>Model</label><Divider /><p>{data()[ 'model' ]}</p>
                        </div>
                        <div>   
                            <label>Plate</label><Divider /><p>{data()[ 'plate' ]}</p>
                        </div>
                        <div>
                            <label>Mileage</label><Divider /><p>{data()[ 'mileage' ]}</p>
                        </div>
                    </Columns>
                    <div class='flex flex-row items-center justify-between'>
                        <LinkButton href='/plate-info' disabled={submitting()}>Back</LinkButton>
                        <SubmitButton buttonStyle={ButtonStyles.PRIMARY} disabled={submitting()}>Confirm</SubmitButton>
                    </div>
                </Form>

                {submitting() || loading() && <LoadingDisplay message={submitting() ? 'Submitting' : (loading() ? 'Getting Info' : '')} />}
                {
                    error() && <div class='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-white'>
                        <p class='text-red-500'>{error()}</p>
                        <LinkButton href='/'>Restart</LinkButton>
                    </div>
                }
            </Panel>
        </Section>
    </>;

};

export default UserInfo;