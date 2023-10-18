import { ParentComponent } from 'solid-js';
import { twMerge } from 'tailwind-merge';


export const Section: ParentComponent = (props) => {

    return (
        <section class='mt-8 flex w-screen flex-col items-center [&>*]:max-w-screen-sm'>
            {props.children}
        </section>
    );

};

export const Panel: ParentComponent<{class?: string}> = (props) => {

    return (
        <div class={twMerge('m-4 rounded p-8 shadow-lg outline outline-1 outline-gray-300 flex flex-col items-center justify-start', props.class)}>
            {props.children}
        </div>
    );

};

export const Columns: ParentComponent = (props) => {

    return (
        <div class='flex flex-row items-start justify-between [&>*:not(&>*:first-child)]:ml-4'>
            {props.children}
        </div>
    );

};