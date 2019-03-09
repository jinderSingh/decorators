import { COLUMN_NAMES, COLUMN_NUMBERS, EXCEL_METADATA, PROP } from "./decorators/constants";

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
export function getNestedPropertyValueFromObject(obj, prop): any {
    if (!obj || !prop) {
        return;
    }
    return Object.keys(obj)
        .reduce((prev, next) => obj[prop] || obj[next][prop], undefined);
}


/**
 * checks if array is empty or not
 * @param val 
 */
export function isArrayNotEmpty(arr: []): boolean {
    if (!arr) {
        return;
    }
    return Array.isArray(arr) && arr.length > 0;
}

/**
 * Check if input has any value
 * @param {T} value
 * @returns {boolean}
 */
export function hasValue < T > (value: T): boolean {
    return value !== null && value !== undefined;
}

/**
 * converts array of objects to array of arrays, using classType metadata
 * TODO implement the logic
 * @param objectArrays 
 * @param classType 
 */
export function objectToExcel(classType: new() => any): (arr: []) => any[][] {
    const metadata = classType.prototype[EXCEL_METADATA];

    // {COLUMN_NAME: {name: {prop: 'name', transformer: null}}, COLUMN_NUMBER:{ name: {prop: 1, transformer: null}}}

    if (!hasValue(metadata)) {
        throw new Error(`Metadata not found on class ${classType.constructor.name}. Please annotate class type with @excelColumn decorator.`);
    }

    const shouldUseColumnNumbers = hasValue(metadata[COLUMN_NUMBERS]);

    const metadataToUse = metadata[shouldUseColumnNumbers ? COLUMN_NUMBERS : COLUMN_NAMES];

    const properties = Object.keys(metadataToUse);

    const headers = shouldUseColumnNumbers ? null : properties
        .reduce((old, newVal) => old.concat(metadataToUse[newVal][PROP]), []);

    return (objectArrays: any[]) => {
        if (!hasValue(objectArrays)) {
            return [];
        }
        let result = [];

        if (headers) {
            result.push(headers);
        }

        return objectArrays.reduce((prev, next) => {
            const row = properties.reduce((previous, key, index) => {
                const valueIndex = shouldUseColumnNumbers ? +metadataToUse[key].prop : index;
                previous[valueIndex] = next[key];
                return previous;
            }, []);
            
            prev.push(row);
            return prev;
        }, result);
    };
};