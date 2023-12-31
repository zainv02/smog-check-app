import { useNavigate } from '@solidjs/router';
import { Component, JSX, createEffect, createSignal } from 'solid-js';

import { ButtonStyles, LinkButton, SubmitButton } from '$components/Button';
import { Form, InputField } from '$components/Form';
import { Title } from '$components/Header';
import { getInvoice, sendInvoice } from '$src/backendHook';
import { useLoadingState } from '$src/contexts/loadingState';
import { useSessionState } from '$src/contexts/sessionState';
import { getFormFields } from '$src/utils/formUtils';




const InvoicePage: Component = () => {

    const [ invoiceImageDataUrl, setInvoiceImageDataUrl ] = createSignal(undefined);
    const { addLoadingPromise } = useLoadingState();
    const { valid, session } = useSessionState();
    const navigate = useNavigate();


    createEffect(() => {

        if (!valid()) {

            return;
        
        }

        addLoadingPromise(getInvoice({ session: session() })).then(result => {

            if (!result) {

                return;
            
            }
    
            setInvoiceImageDataUrl(result);
        
        });
    
    });

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        const fields = getFormFields(e.currentTarget);

        if (!fields[ 'email' ]) {

            console.error('email is missing');
            return;
        
        }

        const result = await addLoadingPromise(sendInvoice({ session: session() }, { email: fields[ 'email' ] as string }), 'Sending Invoice');

        if (!result) {

            console.error('failed to send invoice');
            return;
        
        }

        console.log('invoice sent');
        navigate('/finish' + `?${new URLSearchParams({ session: session() })}`, { replace: true });
        
    };

    return (
        <>
            <Title>Invoice</Title>
            <div class='flex h-[600px] max-h-fit w-full flex-col items-center overflow-y-scroll bg-gray-700 py-8 shadow-inner outline outline-[1px] outline-gray-200'>
                {
                    invoiceImageDataUrl() 
                        ?
                        <img src={invoiceImageDataUrl()} alt='invoice image' class='w-[500px] shadow-lg outline outline-[1px] outline-gray-200' />
                        :
                        <div class='flex h-[500px] w-[500px] flex-col items-center justify-center bg-white shadow-lg outline outline-[1px] outline-gray-200'>No Invoice</div>
                }
            </div>
            <p class='mt-4'>Please enter your email to receive a digital copy</p>
            <Form onSubmit={handleSubmit}>
                <div class='mt-4 flex flex-row items-center gap-4'>
                    <LinkButton href={'/sign' + `?${new URLSearchParams({ session: session() })}`} replace={true}>Back</LinkButton>
                    <div class='w-[16rem]'>
                        <InputField name='email' type='email' placeholder='Email' required={true} />
                    </div>
                    <SubmitButton buttonStyle={ButtonStyles.PRIMARY}>Submit</SubmitButton>
                </div>
            </Form>
        </>
    );

};

export default InvoicePage;