

export function filterObject(obj: object, keys: string[] = []): object {

    return Object.fromEntries(
        Object.entries(obj).filter(([ key ]) => keys.includes(key))
    );

}