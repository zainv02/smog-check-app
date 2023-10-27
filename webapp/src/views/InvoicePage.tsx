import { useSearchParams } from '@solidjs/router';
import { Component, JSX, createEffect, createSignal } from 'solid-js';

import { ButtonStyles, SubmitButton } from '$components/Button';
import { Form, InputField } from '$components/Form';
import { Title } from '$components/Header';
import { getInvoice } from '$src/backendHook';
import { useLoadingState } from '$src/contexts/loadingState';
import { useSessionState } from '$src/contexts/sessionState';




const InvoicePage: Component = () => {

    const [ searchParams ] = useSearchParams();
    const [ invoiceImageDataUrl, setInvoiceImageDataUrl ] = createSignal(undefined);
    const { addLoadingPromise } = useLoadingState();
    const { valid } = useSessionState();


    createEffect(() => {

        if (!valid()) {

            return;
        
        }

        addLoadingPromise(getInvoice({ session: searchParams[ 'session' ] })).then(result => {

            if (!result) {

                return;
            
            }
    
            setInvoiceImageDataUrl(result);
        
        });
    
    });

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = (e) => {

        e.preventDefault();

        
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