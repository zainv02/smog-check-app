import { JSX, ParentComponent, createEffect, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';


export const Section: ParentComponent<{class?: string} & Omit<JSX.HTMLElementTags['section'], 'class'>> = (props) => {

    const [ spreadProps, setSpreadProps ] = createSignal({});
 
    createEffect(() => {

        // eslint-disable-next-line solid/reactivity
        const { class: _class,...otherProps } = props;
        setSpreadProps(otherProps);
    
    });

    return (
        <section class={twMerge('mt-8 flex w-screen flex-col items-center [&>*]:max-w-screen-sm', props.class)} {...spreadProps()}>
            {props.children}
        </section>
    );

};

export const Panel: ParentComponent<{class?: string} & Omit<JSX.HTMLElementTags['div'], 'class'>> = (props) => {

    const [ spreadProps, setSpreadProps ] = createSignal({});
 
    createEffect(() => {

        // eslint-disable-next-line solid/reactivity
        const { class: _class,...otherProps } = props;
        setSpreadProps(otherProps);
    
    });

    return (
        <div class={twMerge('m-4 rounded p-8 shadow-lg outline outline-1 outline-gray-300 flex flex-col items-center justify-start', props.class)} {...spreadProps()}>
            {props.children}
        </div>
    );

};

export const Columns: ParentComponent<{class?: string} & Omit<JSX.HTMLElementTags['div'], 'class'>> = (props) => {

    const [ spreadProps, setSpreadProps ] = createSignal({});
 
    createEffect(() => {

        // eslint-disable-next-line solid/reactivity
        const { class: _class,...otherProps } = props;
        setSpreadProps(otherProps);
    
    });

    return (
        <div class={twMerge('flex flex-row items-start justify-between [&>*:not(&>*:first-child)]:ml-4', props.class)} {...spreadProps()}>
            {props.children}
        </div>
    );

};

