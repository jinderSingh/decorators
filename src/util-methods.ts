/**
 * checks if object has property
 * @param object 
 * @param prop 
 */
export function objectHasCustomProp(object: any, prop: string): boolean {
    return object && object[prop];
}


/**
 * checks if argument is type of object
 * @param obj 
 */
export function isObject(obj): boolean {
    return obj === Object(obj);
}

/**
 * Returns property key if it's value equal to valueToCompare
 * @param valueToCompare value to compare with
 * @param object
 */
export function getKeyIfValueIsEqualTo(valueToCompare, object): string | undefined {
    for (const prop in object) {
        if (object[prop] === valueToCompare) {
            return prop;
        }
    }

    return undefined;
}

/**
 * Works same as Object.values(obj) 
 * @param obj from where to extract values
 */
export function getObjectKeysValues(obj): any[] {
    if (Object['values']) {
        return Object['values'](obj);
    }
    return Object.keys(obj).map(key => obj[key]);
}


/**
 * checks if argument is type of function
 * @param fun 
 */
export function isFunction(fun): boolean {
    return typeof fun === 'function';
}

/**
 * gets property value from nested object
 * @param obj 
 * @param prop 
 */
export function getNestedPropertyValueFromObject(obj, prop) {
    if (!obj || !prop) {
        return;
    }
    return Object.keys(obj)
        .reduce((prev, next) => obj[prop] || obj[next][prop], undefined);
}