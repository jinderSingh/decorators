import { COLUMN_NAMES, COLUMN_NUMBERS, EXCEL_METADATA, PROP } from "./decorators/constants";
import { hasValue } from "./util-methods";

/**
 * converts array of objects to array of arrays, using classType metadata
 * 
 * @param objectArrays 
 * @param classType 
 */
export function objectToExcel < T > (classType: new() => T): (arr: []) => any[][] {
    const metadata = classType.prototype[EXCEL_METADATA];
    const classInstance = new classType();

    if (!hasValue(metadata)) {
        throw new Error(`Metadata not found on class ${classInstance.constructor.name}. Please annotate class type properties with @excelColumn decorator.`);
    }

    const shouldUseColumnNumbers = hasValue(metadata[COLUMN_NUMBERS]);

    const metadataToUse = metadata[shouldUseColumnNumbers ? COLUMN_NUMBERS : COLUMN_NAMES];

    const properties = Object.keys(metadataToUse);

    const headers = shouldUseColumnNumbers ? null : properties
        .reduce((old, newVal) => old.concat(metadataToUse[newVal][PROP]), []);

    return (objectArrays: T[]) => {
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