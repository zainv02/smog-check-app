import { Component } from 'solid-js';

import SpinnerIcon from '$src/assets/spinner.svg';

export const LoadingDisplay: Component = () => {


    return (
        <div class='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white opacity-80'>
            <div>
                <SpinnerIcon class='h-12 w-12 animate-spin' />
            </div>
        </div>
    );

};