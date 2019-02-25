import { getKeyIfValueIsEqualTo, getObjectKeysValues, isObject, objectHasCustomProp } from '../util-methods';
import { CELL_VALUE_TRANSFORMER, COLUMN_NAMES, COLUMN_NUMBERS, EXCEL_METADATA } from './constants';

/**
 * Overrides setter and getter of property
 * @param targetClass class type to which each row should be mapped
 */
export function excelRows < T > (targetClass: new() => T) {
  return function (target: any, key: string) {
    let value = target[key];

    const getter = function () {
      return value;
    };

    const setter = function (val: any) {
      let result = null;
      const typeInstance = new targetClass();
      const metadata = typeInstance[EXCEL_METADATA];
      if (Array.isArray(val)) {
        const headers = getObjectKeysValues(metadata[COLUMN_NUMBERS]);
        result = mapValuesToTargetTypeObjects(headers, val, targetClass, metadata[COLUMN_NUMBERS])
      } else if (isObject(val)) {
        if (!objectHasCustomProp(val, 'headers')) {
          throw new Error(`Header property is not present for setter. Input should be {headers: [], results: []}`);
        }
        const {
          headers,
          results
        } = val;
        checkIfInputIsValid(headers, targetClass);
        result = mapValuesToTargetTypeObjects(headers, results, targetClass, metadata[COLUMN_NAMES]);
      }

      value = result;
    };


    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        configurable: true,
        enumerable: true
      });
    }
  };
}

/**
 * Given headers array, rows and type class, returns array containing objects of type target class
 * @param headers headers array
 * @param results excel rows [][]
 * @param targetClass class type which to map each row 
 */
export function mapValuesToTargetTypeObjects(headers, results, targetClass: new() => any, metadata: any) {
  return results.reduce((prev, next) => {
    const newInstanceOfTargetClass = new targetClass();

    headers.forEach((header, index) => {
      const mappedPropertyName = getKeyIfValueIsEqualTo(header, metadata);
      if (mappedPropertyName) {
        const originalValue = next[index];
        const transformer = newInstanceOfTargetClass[CELL_VALUE_TRANSFORMER] && newInstanceOfTargetClass[CELL_VALUE_TRANSFORMER][mappedPropertyName];

        let valueToSet = originalValue;

        if (transformer) {
          valueToSet = transformer.call(undefined, valueToSet);
        }

        newInstanceOfTargetClass[mappedPropertyName] = valueToSet;
      }
    });

    return prev.concat(newInstanceOfTargetClass);
  }, []);
};


function checkIfInputIsValid(headers: string[], targetClass: new() => any) {
  const instance = new targetClass();
  if (!headers && !objectHasCustomProp(instance, COLUMN_NUMBERS)) {
    throw new Error(`There are no headers present and column neither. 
    To convert excel response to object please provide at least column number prop in @ExcelColumn decorator.`)
  }
}