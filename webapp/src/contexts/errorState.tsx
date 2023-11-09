import { Accessor, JSXElement, ParentComponent, Setter, Show, createContext, createSignal, useContext } from 'solid-js';


const ErrorContext = createContext();


export type ErrorStateContext = {
    error: Accessor<string>,
    setError: Setter<string>,
    children: Accessor<JSXElement>,
    setChildren: Setter<JSXElement>,
    clearError: () => void
};

let createCount = 0;

let created = false;

export const ErrorProvider: ParentComponent = (props) => {

    if (created) {

        // eslint-disable-next-line solid/components-return-once
        return;
    
    }

    created = true;

    console.log('ERROR STATE PROVIDER! COMPONENT LEVEL', ++createCount);

    const [ errorMessage, setErrorMessage ] = createSignal<string>('');
    const [ children, setChildren ] = createSignal<JSXElement>(undefined);
    const clearError = () => {

        setErrorMessage('');
        setChildren(undefined);
    
    };

    const errorStateContext: ErrorStateContext = {
        error: errorMessage,
        setError: setErrorMessage,
        children,
        setChildren,
        clearError
    };

    return (
        <ErrorContext.Provider value={errorStateContext}>
            {props.children}
            <Show when={errorMessage() !== undefined && errorMessage().length > 0}>
                <div class='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-white'>
                    <p class='p-4 text-center text-red-500'>{errorMessage()}</p>
                    {children()}
                </div>
            </Show>
        </ErrorContext.Provider>
    );

};

export function useErrorState() {

    return useContext(ErrorContext) as ErrorStateContext;

}