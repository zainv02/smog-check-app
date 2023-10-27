import { useNavigate } from '@solidjs/router';
import { Accessor, ParentComponent, Setter, createContext, createEffect, createSignal, onMount, useContext } from 'solid-js';

import { useErrorState } from './errorState';
import { useLoadingState } from './loadingState';

import { Button } from '$components/Button';
import { checkSession } from '$src/backendHook';



const SessionContext = createContext();

export type CheckSessionStateFunction = (opts?: {session?: string, forceCheck?: boolean}) => Promise<boolean>

export type SessionStateContext = {
    checking: Accessor<boolean>,
    valid: Accessor<boolean>,
    setSession: Setter<string>
    checkSessionState: CheckSessionStateFunction
};

export const SessionStateProvider: ParentComponent<{session: string, autoCheck?: boolean, exclude?: string[]}> = (props) => {
    
    let checked: boolean = false;
    const [ checking, setChecking ] = createSignal<boolean>(false);
    const [ valid, setValid ] = createSignal<boolean>(false);
    const { addLoadingPromise } = useLoadingState();
    const [ sessionId, setSessionId ] = createSignal<string>(undefined);

    const { setError, setChildren } = useErrorState();

    const navigate = useNavigate();

    const checkSessionState: CheckSessionStateFunction = async (opts) => {

        // eslint-disable-next-line solid/reactivity
        if (checked && !opts?.forceCheck) {

            // eslint-disable-next-line solid/components-return-once
            return valid();
        
        }

        setValid(false);
        setChecking(true);
        // eslint-disable-next-line solid/reactivity
        const promise = checkSession({ session: opts?.session || sessionId() });
        addLoadingPromise(promise, 'Checking Session');
        const result = await promise;

        if (!result) {

            setValid(false);
            setError('The current session is invalid or expired');
            setChildren(
                <Button onClick={() => {

                    // window.location.href = new URL(window.location.host).toString();
                    navigate('/');

                }}>Restart</Button>
            );

        } else {

            setValid(true);
        
        }

        setChecking(false);
        checked = true;

        return valid();
    
    };

    const sessionState: SessionStateContext = {
        checking,
        valid,
        setSession: setSessionId,
        checkSessionState
    };

    onMount(async () => {

        setSessionId(props.session);

        

    });

    createEffect(() => {

        if (!props.autoCheck) {

            setValid(true);
            return;
        
        }

        if (props.exclude && props.exclude.includes(window.location.pathname)) {

            setValid(true);
            return;
        
        }

        checkSessionState({ session: sessionId(), forceCheck: true });
    
    });

    return (
        <SessionContext.Provider value={sessionState}>
            {props.children}
        </SessionContext.Provider>
    );

};

export function useSessionState() {

    return useContext(SessionContext) as SessionStateContext;

}