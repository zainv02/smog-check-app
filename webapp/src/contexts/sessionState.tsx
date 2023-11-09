import { useLocation, useNavigate, useSearchParams } from '@solidjs/router';
import { Accessor, ParentComponent, Setter, createContext, createEffect, createSignal, useContext } from 'solid-js';

import { useErrorState } from './errorState';
import { useLoadingState } from './loadingState';

import { Button } from '$components/Button';
import { checkSession } from '$src/backendHook';

console.log('SESSION STATE PROVIDER! TOP LEVEL');

const SessionContext = createContext();

export type CheckSessionStateFunction = (opts?: {session?: string, forceCheck?: boolean}) => Promise<void>

export type SessionStateContext = {
    checking: Accessor<boolean>,
    valid: Accessor<boolean>,
    setSession: Setter<string>,
    session: Accessor<string>
};

let created = false;

export const SessionStateProvider: ParentComponent<{paramName?: string, exclude?: string[]}> = (props) => {
    
    if (created) {

        // eslint-disable-next-line solid/components-return-once
        return;
    
    }

    created = true;

    console.log('SESSION STATE PROVIDER! COMPONENT LEVEL');

    let checked: boolean = false;
    let _checking: boolean = false;
    const [ checking, setChecking ] = createSignal<boolean>(false);
    const [ valid, setValid ] = createSignal<boolean>(false);
    const { addLoadingPromise } = useLoadingState();
    const [ sessionId, setSessionId ] = createSignal<string>(undefined);

    const { setError, setChildren } = useErrorState();
    const location = useLocation();

    const navigate = useNavigate();

    const reset = () => {

        setChildren(undefined);
        setError('');
    
    };

    const checkSessionState: CheckSessionStateFunction = async (opts) => {

        console.log('function CHECKSESSIONSTATE being called');

        // eslint-disable-next-line solid/reactivity
        if (checked && !opts?.forceCheck) {

            // eslint-disable-next-line solid/components-return-once
            return;
        
        }

        if (_checking) {

            // eslint-disable-next-line solid/components-return-once
            return;
        
        }

        _checking = true;
        setChecking(true);

        setValid(false);
        
        
        // eslint-disable-next-line solid/reactivity
        const result = await addLoadingPromise(checkSession({ session: opts?.session || sessionId() }), 'Checking Session');

        if (!result) {

            setValid(false);
            setError('The current session is invalid or expired');
            setChildren(
                <Button onClick={() => {

                    navigate('/', { replace: true });

                }}>Restart</Button>
            );

        } else {

            setValid(true);
        
        }

        setChecking(false);
        _checking = false;   
        checked = true;
    
    };

    const sessionState: SessionStateContext = {
        checking,
        valid,
        setSession: setSessionId,
        session: sessionId,
    };

    createEffect(() => {

        const paramName = props.paramName || 'session';
        const [ searchParams ] = useSearchParams();
        console.log('session changed to ', searchParams[ paramName ]);
        reset();
        setSessionId(searchParams[ paramName ]);
    
        // });

        // createEffect(() => {

        console.log('sessionState props', props);
        console.log('current path', location.pathname);

        if (props.exclude && props.exclude.includes(location.pathname)) {

            console.log(location.pathname, 'is exluded, ignoring');
            setValid(true);
            return;
        
        }

        // const paramName = props.paramName || 'session';
        // const [ searchParams ] = useSearchParams();

        console.log('about to check session state', searchParams[ paramName ]);

        checkSessionState({ session: searchParams[ paramName ], forceCheck: true });
 
        
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