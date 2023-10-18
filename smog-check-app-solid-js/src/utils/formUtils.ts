import { JSX } from 'solid-js';


type FieldValue = JSX.InputHTMLAttributes<HTMLInputElement>['value'] | JSX.SelectHTMLAttributes<HTMLSelectElement>['value'];

type FieldsObject = {[key: string]: FieldValue};

type FormFieldsObjectGetter = (form: HTMLFormElement) => FieldsObject;

export const getFormFields: FormFieldsObjectGetter = ((form) => {

    const fields: FieldsObject = {};

    const inputs = form.querySelectorAll('input, select') as unknown as (HTMLInputElement | HTMLSelectElement)[];

    inputs.forEach(input => {

        const name = input.name;
        if (name) {

            fields[ name ] = input.value;
            
        }
        
    });

    return fields;

});