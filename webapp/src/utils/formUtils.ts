import { JSX } from 'solid-js';


type FieldValue = JSX.HTMLElementTags['input']['value'] | JSX.HTMLElementTags['select']['value'];

type FieldsRecord = {[key: string]: FieldValue};

type FormFieldsObjectGetter = (form: HTMLFormElement) => FieldsRecord;

export const getFormFields: FormFieldsObjectGetter = ((form) => {

    const fields: FieldsRecord = {};

    const inputs = form.querySelectorAll('input, select') as unknown as (HTMLInputElement | HTMLSelectElement)[];

    inputs.forEach(input => {

        const name = input.name;
        if (name) {

            fields[ name ] = input.value;
            
        }
        
    });

    return fields;

});