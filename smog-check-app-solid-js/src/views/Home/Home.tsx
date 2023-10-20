import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';

import { ButtonStyles, Button } from '$components/Button';
import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';


const Home: Component = () => {

    const navigate = useNavigate();

    return (
        <Section>
            <Panel>
                <Title>Start Here</Title>
                <Button buttonStyle={ButtonStyles.PRIMARY} class='px-8 py-4 text-4xl' onClick={() => {

                    navigate('/plate-info');

                }}>Start</Button>
            </Panel>
        </Section>
    );

};

export default Home;