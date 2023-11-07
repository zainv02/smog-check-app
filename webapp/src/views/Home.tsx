import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';

import { ButtonStyles, Button } from '$components/Button';
import { Title } from '$components/Header';


const Home: Component = () => {

    const navigate = useNavigate();

    return (
        <>
            <Title>Start Here</Title>
            <Button buttonStyle={ButtonStyles.PRIMARY} class='px-8 py-4 text-4xl' onClick={() => {

                navigate('/plate-info', { replace: true });

            }}>Start</Button>
        </>
    );

};

export default Home;