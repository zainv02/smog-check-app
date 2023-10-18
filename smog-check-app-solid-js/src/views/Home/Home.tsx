import { Component } from 'solid-js';

import { ButtonStyles, LinkButton } from '$components/Button';
import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';


const Home: Component = () => {


    return (
        <Section>
            <Panel>
                <Title>Start Here</Title>
                <LinkButton href='/plate-info' buttonStyle={ButtonStyles.PRIMARY} class='px-8 py-4 text-4xl'>Start</LinkButton>
            </Panel>
        </Section>
    );

};

export default Home;