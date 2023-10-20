import { Component } from 'solid-js';

import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';




const InvoicePage: Component = () => {

    return (
        <Section>
            <Panel>
                <Title>Invoice</Title>
            </Panel>
        </Section>
    );

};

export default InvoicePage;