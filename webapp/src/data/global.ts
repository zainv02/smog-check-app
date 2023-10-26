
import { createStore, produce } from 'solid-js/store';

const [ global, setGlobal ] = createStore({});

function setGlobalValue(key: string, value: unknown) {

    setGlobal(
        produce((state) => {

            state[ key ] = value;
        
        })
    );

}


export { global, setGlobalValue };