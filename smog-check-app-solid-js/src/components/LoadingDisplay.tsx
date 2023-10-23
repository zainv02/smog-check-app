import { Component, JSX } from 'solid-js';
import { twMerge } from 'tailwind-merge';

import SpinnerIcon from '$src/assets/spinner.svg';

export const LoadingDisplay: Component<JSX.HTMLElementTags['div'] & { message?: string }> = (props) => {


    return (
        <div class={twMerge('absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white opacity-80', props.class)}>
            <div class='flex flex-col items-center justify-center'>
                {props.message !== undefined && props.message.length > 0 && <p>{props.message}</p>}
                <SpinnerIcon class='h-12 w-12 animate-spin' />
            </div>
        </div>
    );

};