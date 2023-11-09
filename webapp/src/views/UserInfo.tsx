import { useNavigate } from '@solidjs/router';
import { Component, JSX, createEffect, createSignal } from 'solid-js';

import { SubmitButton, ButtonStyles, LinkButton, Button } from '$components/Button';
import { Divider, FieldInputWidthMode, FieldLabelMode, Form, InputField } from '$components/Form';
import { Title } from '$components/Header';
import { Columns } from '$components/Layout';
import { getUserInfo, updateUserInfo } from '$src/backendHook';
import { useErrorState } from '$src/contexts/errorState';
import { useLoadingState } from '$src/contexts/loadingState';
import { useSessionState } from '$src/contexts/sessionState';
import { RouteComponentProps } from '$src/types';
import { getFormFields } from '$src/utils/formUtils';

// https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
function getLocalISOString() {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    return localISOTime;
}

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
const UserInfo: Component<RouteComponentProps> = () => {

    const { addLoadingPromise } = useLoadingState();
    const { setError, setChildren } = useErrorState();
    const { valid, session } = useSessionState();

    const navigate = useNavigate();

    const [ submitting, setSubmitting ] = createSignal(false);

    const [ data, setData ] = createSignal({});

    createEffect(() => {

        if (!valid()) {

            return;
        
        }

        addLoadingPromise(getUserInfo({ session: session() }), 'Getting info').then(result => {

            if (!result) {

                console.error('failed to geut ser info');
                setError('Failed to get information. The session could have expired, or there is a problem with the server.');
                setChildren(<Button onClick={() => {

                    navigate('/', { replace: true });

                }}>Restart</Button>);
                return;
            
            }
    
            setData(result);
        
        });
    
    }, undefined, { name: 'user-info-effect' });

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        if (submitting()) {

            return;
        
        }

        setSubmitting(true);

        const fields = getFormFields(e.currentTarget);

        console.log('updating user info with', fields);

        // submit fields to update customer data
        const result = await addLoadingPromise(updateUserInfo({ session: session() }, fields), 'Submitting');

        if (!result) {

            console.error('failed to update user info');
            setSubmitting(false);
            return;
        
        }

        console.log('updated info');

        navigate('/sign' + `?${new URLSearchParams({ session: session() })}`, { replace: true });
    
    };

    return (
        <>
            <Title>Customer Info</Title>
            
            <Form onSubmit={handleSubmit}>
                <Columns>
                    <InputField name='name' label='Name:' labelMode={FieldLabelMode.TOP} type='text' value={data()[ 'name' ]} required={true} />
                    <InputField name='date' label='Date:' labelMode={FieldLabelMode.TOP} type='date' value={getLocalISOString()} required={true} />
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
                    <LinkButton href={'/plate-info'} replace={true}>Back</LinkButton>
                    <SubmitButton buttonStyle={ButtonStyles.PRIMARY} disabled={submitting()}>Confirm</SubmitButton>
                </div>
            </Form>
        </>
    );

};

export default UserInfo;