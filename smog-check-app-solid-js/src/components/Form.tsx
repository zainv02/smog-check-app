import { ParentComponent, For , Component, JSX, createSignal, createEffect } from 'solid-js';
import { twMerge } from 'tailwind-merge';


export const Form: ParentComponent<{[key in keyof Omit<JSX.HTMLElementTags['form'], 'class'>]: JSX.HTMLElementTags['form'][key]}> = (props) => {

    return (
        <form class='flex flex-col items-center [&>*]:mt-4 [&>*]:w-full' {...props}>
            {props.children}
        </form>
    );

};


type InputFieldType = 'text' | 'email' | 'number' | 'password' | 'url' | 'tel' | 'date' | 'datetime-local';

type InputValidatorFunctionResult = boolean | { valid: boolean, message: string };
type InputValidatorFunction = (value: JSX.InputHTMLAttributes<HTMLInputElement>['value']) => InputValidatorFunctionResult;
type InputValidator = InputValidatorFunction;

type FieldProps<TElement extends HTMLElement, TAttributes extends JSX.HTMLAttributes<TElement> = JSX.HTMLAttributes<TElement>> = {
    name: string,
    label?: string,
    attr?: {[key in keyof TAttributes]: TAttributes[key]},
    errorVisible?: boolean,
    errorMessage?: string
    // handlers?: {[key in keyof JSX.CustomEventHandlersCamelCase<HTMLInputElement>]: JSX.CustomEventHandlersCamelCase<HTMLInputElement>[key]},
};

export const Field: ParentComponent<FieldProps<HTMLElement>> = (props) => {

    const [ errorVisible, setErrorVisible ] = createSignal<boolean>(false);
    const [ errorMessage, setErrorMessage ] = createSignal<string>('');

    createEffect(() => {

        setErrorVisible(props.errorVisible || false);
        setErrorMessage(props.errorMessage || '');
    
    });

    // const labelWidthPart = 2;
    // const inputWidthPart = 3;
    // const labelWidthPercent = labelWidthPart / inputWidthPart;
    // const inputWidthPercent = 1 - labelWidthPercent;

    return (
        <div class='flex w-full flex-row items-start justify-between'>
            {props.label && <label for={props.name} class='mr-2 h-8 w-[40%] max-w-[40%]'>{props.label}</label>}
            <div class={twMerge('flex flex-col items-end justify-start', props.label ? 'w-[60%] max-w-[60%]' : 'w-full max-w-full')}>
                <div class='h-8 w-full'>
                    {props.children}
                </div>
                <p class='w-full text-sm text-red-500' style={{ display: errorVisible() ? 'block' : 'none' }}>{errorMessage()}</p>
            </div>
        </div>
    );

};

// type KeypressData = {
//     key: KeyboardEvent['key'],
//     code: KeyboardEvent['code'],
//     altKey: KeyboardEvent['altKey'],
//     shiftKey: KeyboardEvent['shiftKey'],
//     ctrlKey: KeyboardEvent['ctrlKey'],
//     metaKey: KeyboardEvent['metaKey'],
//     repeat: KeyboardEvent['repeat']
// };

// https://github.com/facebook/react/issues/10135
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setNativeValue(element: HTMLElement, value: unknown) {

    const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
    const prototype = Object.getPrototypeOf(element);
    const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {

        prototypeValueSetter.call(element, value);
    
    } else if (valueSetter) {

        valueSetter.call(element, value);
    
    } else {

        throw new Error('The given element does not have a value setter');
    
    }

}

type InputFieldProps = FieldProps<HTMLInputElement, JSX.InputHTMLAttributes<HTMLInputElement>> & {
    
    type?: InputFieldType,

    inputTransformer?: (char: string) => string | boolean,

    customHandlers?: {
        onInput?: (
            e: InputEvent & {
                currentTarget: HTMLInputElement;
                target: HTMLInputElement;

            }
        ) => void,
        onKeypress?: (
            e: KeyboardEvent & {
                currentTarget: HTMLInputElement;
                target: Element;
            }
        ) => void
    },

    checkDelay?: number,

    validators?: InputValidator[]
}

export const InputField: Component<InputFieldProps> = (props) => {

    const [ errorVisible, setErrorVisible ] = createSignal<boolean>(false);
    const [ errorMessage, setErrorMessage ] = createSignal<string>('');
    const [ checkDelay, setCheckDelay ] = createSignal<number>(500);

    createEffect(() => {

        setCheckDelay(props.checkDelay || 500);
        
    });

    let checkTimer;

    let inputElement: HTMLInputElement;

    const handleCheckValidity = async () => {

        // console.log('checking validity', inputElement.value);
        inputElement.setCustomValidity('');

        // check default input validity first from validation attributes
        let valid: boolean = inputElement.checkValidity();
        
        // if valid, check each custom validator
        if (valid && props.validators) {

            for (const validator of props.validators) {

                let result = await Promise.resolve(validator(inputElement.value));

                if (typeof result === 'boolean' || typeof result === 'undefined') {
                    
                    result = { valid: result !== undefined ? result : false, message: 'Invalid input' };
                
                }

                if (!result.valid) {

                    inputElement.setCustomValidity(result.message);
                    valid = false;
                    break;
            
                }
        
            }
        
        }        

        // console.log('isValid?', valid);

        if (!valid) {

            setErrorMessage(inputElement.validationMessage);
            setErrorVisible(true);
            
        } else {

            setErrorVisible(false);
            
        }
    
    };

    let pastedData = '';
    let prevStart = 0;
    let prevEnd = 0;
    let prevValue = '';

    const defaultBehaviourInputTypes = {
        'historyUndo': true,
        'deleteContentBackward': true,
        'deleteContentForward': true
    };

    const handleInput: JSX.HTMLElementTags['input']['onInput'] = (e) => {

        props.customHandlers?.onInput?.(e);

        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const inputTransformer = props.inputTransformer;

        if (inputTransformer && !(e.inputType in defaultBehaviourInputTypes)) {       

            const attemptedInput = pastedData.length > 0 ? pastedData : e.data || target.value;

            let transformedInput = '';

            for (let i = 0; i < attemptedInput.length; i++) {

                const result = inputTransformer(attemptedInput[ i ]);

                if (typeof result === 'boolean') {

                    if (result) {

                        transformedInput += attemptedInput[ i ];
                        continue;

                    }

                    continue;
                
                }

                // implied result is string
                transformedInput += result;
            
            }
            

            const insertCount = prevValue.length + transformedInput.length > target.maxLength ? target.maxLength - prevValue.length : transformedInput.length;

            const insertResult = transformedInput.slice(0, insertCount);
            

            const value = prevValue.slice(0, prevStart) + insertResult + prevValue.slice(prevEnd);

            setNativeValue(target, value);

            target.selectionStart = target.selectionEnd = prevStart + insertCount;

        }
        
        prevValue = target.value;
        pastedData = '';
        prevStart = start;
        prevEnd = end;

        // prevent skipping validity check, though it is only client side!
        inputElement.setCustomValidity('Invalid');
        setErrorVisible(false);

        clearTimeout(checkTimer);
        checkTimer = setTimeout(() => {

            handleCheckValidity();

        }, checkDelay());
    
    };

    return (
        <Field name={props.name} label={props.label} errorVisible={errorVisible()} errorMessage={errorMessage()}>
            <input 
                ref={inputElement} 
                type={props.type || 'text'} 
                name={props.name} 
                id={props.name}
                onInput={(e) => {

                    // console.log('input event', e);
                    handleInput(e);

                }}

                onPaste={(e) => {

                    // console.log('paste event', e);
                    pastedData = e.clipboardData.getData('text');
                
                }}

                onKeyDown={(e) => {

                    prevStart = e.currentTarget.selectionStart;
                    prevEnd = e.currentTarget.selectionEnd;

                }}

                {...props.attr} 
                class={'h-full w-full rounded px-2 py-1 outline outline-1 invalid:outline invalid:outline-2 invalid:outline-red-500'} 
            />
        </Field>
    );

};

type SelectFieldProps = FieldProps<HTMLSelectElement, JSX.SelectHTMLAttributes<HTMLSelectElement>> & {
    options: [ JSX.OptionHTMLAttributes<HTMLOptionElement>['value'], string ][],
    emptyOption?: boolean,
    emptyOptionText?: string
}

export const SelectField: Component<SelectFieldProps> = (props) => {

    const [ errorVisible, _setErrorVisible ] = createSignal<boolean>(false);
    const [ errorMessage, _setErrorMessage ] = createSignal<string>('');

    return (
        <Field name={props.name} label={props.label} errorVisible={errorVisible()} errorMessage={errorMessage()}>
            <select
                name={props.name} 
                id={props.name} 
                {...props.attr}
                class={'h-full w-full rounded px-2 py-1 outline outline-1 invalid:outline invalid:outline-2 invalid:outline-red-500'}
            >
                {props.emptyOption ? <option disabled selected value=''>{props.emptyOptionText || 'Select'}</option> : <></>}
                <For each={props.options}>{([ value, name ]) => <option value={value}>{name}</option>}</For>
            </select>
        </Field>
    );

};