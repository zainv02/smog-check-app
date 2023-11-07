import { Component } from 'solid-js';

import { ButtonStyles, LinkButton } from '$components/Button';
import { Title } from '$components/Header';
import { useSessionState } from '$src/contexts/sessionState';


const Finish: Component = () => {

    const { session } = useSessionState();

    return (
        <>
            <Title>Thank you!</Title>
            <p>Invoice sent to the provided email. Check to confirm it was received. If not, press back to try again.</p>
            <div class='flex w-full flex-row justify-between'>
                <LinkButton href={'/sign' + `?${new URLSearchParams({ session: session() })}`} replace={true}>Back</LinkButton>
                <LinkButton href='/' replace={true} buttonStyle={ButtonStyles.PRIMARY}>Finish</LinkButton>
            </div>
        </>
    );

};

export default Finish;