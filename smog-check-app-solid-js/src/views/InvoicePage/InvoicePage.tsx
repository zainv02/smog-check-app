import { useSearchParams } from '@solidjs/router';
import { Component, createSignal, onMount } from 'solid-js';

import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';
import { getInvoice } from '$src/backendHook';




const InvoicePage: Component = () => {

    const [ searchParams ] = useSearchParams();
    const [ invoiceImageDataUrl, setInvoiceImageDataUrl ] = createSignal(undefined);
    
    onMount(async () => {

        const result = await getInvoice({ session: searchParams[ 'session' ] });

        if (!result) {

            return;
        
        }

        setInvoiceImageDataUrl(result);

    });

    return (
        <Section>
            <Panel>
                <Title>Invoice</Title>
                <img src={invoiceImageDataUrl()} alt='' />
            </Panel>
        </Section>
    );

};

export default InvoicePage;