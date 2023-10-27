import { JSX, ParentComponent } from 'solid-js';
import { twMerge } from 'tailwind-merge';

import { usePropFilter } from '$src/utils/usePropFilter';


export const Section: ParentComponent<{class?: string} & Omit<JSX.HTMLElementTags['section'], 'class'>> = (props) => {

    const spreadProps = usePropFilter(props, [ 'class' ]);

    return (
        <section class={twMerge('flex w-full flex-col items-center [&>*]:max-w-screen-sm', props.class)} {...spreadProps()}>
            {props.children}
        </section>
    );

};

export const Panel: ParentComponent<{class?: string} & Omit<JSX.HTMLElementTags['div'], 'class'>> = (props) => {

    const spreadProps = usePropFilter(props, [ 'class' ]);

    return (
        <div class={twMerge('rounded p-8 shadow-lg outline outline-1 outline-gray-300 flex flex-col items-center justify-start', props.class)} {...spreadProps()}>
            {props.children}
        </div>
    );

};

export const Columns: ParentComponent<{class?: string} & Omit<JSX.HTMLElementTags['div'], 'class'>> = (props) => {

    const spreadProps = usePropFilter(props, [ 'class' ]);

    return (
        <div class={twMerge('flex flex-row items-start justify-between [&>*:not(&>*:first-child)]:ml-4', props.class)} {...spreadProps()}>
            {props.children}
        </div>
    );

};

