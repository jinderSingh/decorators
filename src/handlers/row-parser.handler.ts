import { hasValue, isArrayNotEmpty, objectHasCustomProp } from "../util-methods";
import { CELL_VALUE_TRANSFORMER, COLUMN_NAMES, COLUMN_NUMBERS, EXCEL_METADATA, PROP } from './../constants/constants';
import { ExcelRowType } from './../models/excel-row.type';

export function mapParamterValueToObjects(val: any[][], classType: new() => any, headerConfs: ExcelRowType = {}): any[] {
    const typeInstance = new classType();
    const metadata = typeInstance[EXCEL_METADATA];

    throwErrorIfInputIsInvalid(headerConfs, metadata);

    const columnNumbersAreDefined = metadata && metadata[COLUMN_NUMBERS];

    const {
        headerRowIndex,
        headers
    } = headerConfs;

    const finalHeaders = columnNumbersAreDefined ? null : (headers || val[headerRowIndex]);

    if (!columnNumbersAreDefined) {
        throwWarningIfHeadersAreEmpty(finalHeaders, typeInstance);
        if (hasValue(headerRowIndex)) {
            val = val.slice(1);
        }
    }


    const mapper = getValueMapper(finalHeaders, metadata);

    if (!mapper) {
        return;
    }

    return mapValuesToTargetTypeObjects(val, classType, mapper);
}




/**
 * Given headers array, rows and type class, returns array containing objects of type target class
 * @param headers headers array
 * @param results excel rows [][]
 * @param targetClass class type which to map each row 
 */
function mapValuesToTargetTypeObjects(results: any[], targetClass: new() => any, mapper: (obj, rows: any[]) => void): any[] {

    return results.reduce((prev, next) => {
        if (!isArrayNotEmpty(next)) {
            return prev;
        }

        const newInstanceOfTargetClass = new targetClass();
        mapper(newInstanceOfTargetClass, next);
        return prev.concat(newInstanceOfTargetClass);
    }, []);
};


/**
 * returns function to map row values to object properties
 * @param values
 * @param metadata 
 */
function getValueMapper(header: string[], metadata: {
    [key: string]: any
}): (obj, rows: any[]) => void {

    const shouldUseColumnNumberMapping = !header;

    const headers = shouldUseColumnNumberMapping ? Object.keys(metadata[COLUMN_NUMBERS]) : header;

    const metadataToUse = metadata[shouldUseColumnNumberMapping ? COLUMN_NUMBERS : COLUMN_NAMES];

    const propertyNamesCache = {};

    return (newInstance, rows: any[]) => {
        headers.forEach((header, index) => {
            const propertyName = propertyNamesCache[header] || (metadataToUse[header] ? header : getObjectKeyByPropertyValue(metadataToUse, PROP, header));

            if (propertyName) {
                const valueIndex = shouldUseColumnNumberMapping ? +metadataToUse[propertyName][PROP] : index;

                const transformer = metadataToUse[propertyName][CELL_VALUE_TRANSFORMER];

                let valueToSet = rows[valueIndex];

                if (transformer) {
                    valueToSet = transformer.call(undefined, valueToSet);
                }

                newInstance[propertyName] = valueToSet;
                propertyNamesCache[header] = propertyName;
            }
        });
    }
}


/**
 * throws expection if input to the setter method is invalid
 * @param val 
 * @param targetClassInstance 
 */
function throwErrorIfInputIsInvalid(val: ExcelRowType, metadata: {
    [key: string]: any
}): void {

    const columnNumbersAreDefined = metadata && metadata[COLUMN_NUMBERS];

    if (!columnNumbersAreDefined) {

        const headersPropertyIsNotDefined = !objectHasCustomProp(val, 'headers');
        const headerRowIndexIsNotDefined = !hasValue(objectHasCustomProp(val, 'headerRowIndex'));

        if (headersPropertyIsNotDefined && headerRowIndexIsNotDefined) {
            throw new Error(`Please provide 'headerRowIndex' or 'headers' to @excelRows when using 'header' property in @excelColumn.`);
        }
    }
}

/**
 * returns object key which value's is equal to valueToCompare
 * @param object {address: {zipCode: 4545}}
 * @param prop 'zipCode'
 * @param valueToCompare 4545 
 * @returns 'address'
 */
function getObjectKeyByPropertyValue(object: {
    [key: string]: {}
}, prop: string | number, valueToCompare: any): string {
    if (!object || (prop === undefined || prop === null)) {
        return;
    }

    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
        if (object[keys[i]][prop] === valueToCompare) {
            return keys[i];
        }
    }
}

function throwWarningIfHeadersAreEmpty(header: string[], classInstance: any): void {
    if (!isArrayNotEmpty(header)) {
        console.warn(`If headers are empty, there will be no mapping to object ${classInstance && classInstance.constructor.name}.`);
    }
}