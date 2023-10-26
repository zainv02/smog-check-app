import { ParentComponent } from 'solid-js';



export const Title: ParentComponent = (props) => {

    return (
        <h1 class='mb-4 mt-2 text-center text-4xl font-semibold'>{props.children}</h1>
    );

};

export const Subtitle: ParentComponent = (props) => {

    return (
        <h1 class='mb-4 mt-2 text-center text-2xl font-semibold'>{props.children}</h1>
    );

};