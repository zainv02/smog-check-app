import { Accessor, ParentComponent, Setter, Show, createContext, createSignal, useContext } from 'solid-js';

import { LoadingDisplay } from '$components/LoadingDisplay';


const LoadingContext = createContext();

export interface LoadingStateContext {
    loading: Accessor<boolean>
    setLoading: Setter<boolean>
    message: Accessor<string>
    setMessage: Setter<string>
    addLoadingPromise: <TResult>(promise: Promise<TResult>, message?: string) => Promise<TResult>
    promiseCount: Accessor<number>
}

let created = false;

export const LoadingStateProvider: ParentComponent = (props) => {

    if (created) {

        // eslint-disable-next-line solid/components-return-once
        return;
    
    }

    created = true;

    console.log('LOADING STATE PROVIDER! COMPONENT LEVEL');

    const [ promiseCount, setPromiseCount ] = createSignal<number>(0);
    const [ loading, setLoading ] = createSignal<boolean>(false);
    const [ message, setMessage ] = createSignal(undefined);
    const loadingPromises: Map<string, {promise: Promise<unknown>, message?: string}> = new Map();

    const addLoadingPromise: LoadingStateContext['addLoadingPromise'] = (promise, message?) => {

        const key = crypto.randomUUID();

        loadingPromises.set(key, { promise, message });

        if (loadingPromises.size === 1) {

            setMessage(message);
        
        }

        setPromiseCount(loadingPromises.size);

        promise.finally(() => {

            loadingPromises.delete(key);

            setPromiseCount(loadingPromises.size);
            if (loadingPromises.size > 0) {

                setMessage(loadingPromises.values().next().value.message);
            
            }

        });

        return promise;
    
    };

    const loadingState: LoadingStateContext = {
        loading,
        setLoading,
        message,
        setMessage,
        addLoadingPromise,
        promiseCount
    };
    
    return (
        <LoadingContext.Provider value={loadingState}>
            {props.children}
            <Show when={loading() || promiseCount() > 0}>
                <LoadingDisplay>{message()}</LoadingDisplay>
            </Show>
        </LoadingContext.Provider>
    );

};

export function useLoadingState() {

    return useContext(LoadingContext) as LoadingStateContext; 

}