import { createEffect, createSignal } from 'solid-js';

/**
 * Return a new object of props that does not include the specified keys
 */
export function usePropFilter(props: object, keys: string[] = []) {

    const [ spreadProps, setSpreadProps ] = createSignal({});

    createEffect(() => {

        const otherProps = Object.fromEntries(
            Object.entries(props).filter(([ key ]) => !keys.includes(key))
        );
        setSpreadProps(otherProps);
    
    });

    return spreadProps;

}