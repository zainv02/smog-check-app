import { A } from '@solidjs/router';
import { ParentComponent, JSX } from 'solid-js';
import { twMerge } from 'tailwind-merge';

const parseVariants = (code: string) => {

    const variantGroupsRegex = /([a-z\-0-9:]+:)\((.*?)\)/g;
    const variantGroupMatches = [ ...code.matchAll(variantGroupsRegex) ];
  
    console.log('matches:', variantGroupMatches);

    variantGroupMatches.forEach(([ matchStr, variants, classes ]) => {

        const parsedClasses = classes
            .split(' ')
            .map((cls) => variants + cls)
            .join(' ');
  
        code = code.replace(matchStr, parsedClasses);
    
    });
  
    return code;

};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function twvg(strings: TemplateStringsArray, ...args: unknown[]) {

    // console.log(strings);
    // recombine string
    let string = '';
    args.forEach((arg, i) => string += strings[ i ] + `${arg}`);
    string += strings[ strings.length - 1 ];
    
    return parseVariants(string);

}

/**
 * 
 * transition-property: all;
 * transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
 * transition-duration: 100ms;
 * 
 * @param props 
 * @returns 
 */

export enum ButtonStyles {
    NEUTRAL = 0,
    PRIMARY = 1,
    WARNING = 2,
    DANGER = 3
}

interface ButtonProps {
    buttonStyle?: ButtonStyles
    class?: string
}

const buttonStyle = 'rounded bg-slate-100 px-4 py-2 text-slate-700 shadow-md transition-all duration-100 active:bg-slate-700 active:text-slate-100';

const createButtonStyle: (opts?: ButtonProps) => string = (opts = {}) => {

    return twMerge(buttonStyle, opts.class, opts.buttonStyle === ButtonStyles.PRIMARY && 'bg-light-10');

};

export const Button: ParentComponent<ButtonProps & {[key in keyof Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'class'>]: JSX.ButtonHTMLAttributes<HTMLButtonElement>[key]}> = (props) => {

    return (
        <button class={createButtonStyle(props)} {...props} >
            {props.children}
        </button>
    );

};

export const LinkButton: ParentComponent<{href: string} & ButtonProps> = (props) => {

    return (
        <A href={props.href} class={createButtonStyle(props)}>
            {props.children}
        </A>
    );

};

export const SubmitButton: ParentComponent<ButtonProps & {[key in keyof Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'class' | 'type'>]: JSX.InputHTMLAttributes<HTMLInputElement>[key]}> = (props) => {

    return (
        <input type='submit' class={createButtonStyle(props)} {...props}>
            {props.children}
        </input>
    );

};
