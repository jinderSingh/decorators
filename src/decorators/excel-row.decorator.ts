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
      if (!val) {
        return;
      }

      const typeInstance = new targetClass();
      const metadata = typeInstance[EXCEL_METADATA];

      let headers, results = val,
        metadataToUse = metadata[COLUMN_NUMBERS];

      throwErrorIfInputIsInvalid(val, typeInstance);

      if (Array.isArray(val)) {
        headers = getObjectKeysValues(metadata[COLUMN_NUMBERS]);
      } else if (isObject(val)) {
        headers = val.headers;
        results = val.results;
        metadataToUse = metadata[COLUMN_NAMES];
      } else {
        return;
      }

      value = mapValuesToTargetTypeObjects(headers, results, targetClass, metadataToUse);

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
        const transformer = newInstanceOfTargetClass[CELL_VALUE_TRANSFORMER] && newInstanceOfTargetClass[CELL_VALUE_TRANSFORMER][mappedPropertyName];
        
        let valueToSet = next[index]; // todo when using columnNumber it should get value next[columnNumber] and other cases should be next[index]

        if (transformer) {
          valueToSet = transformer.call(undefined, valueToSet);
        }
        console.log(mappedPropertyName, valueToSet);
        newInstanceOfTargetClass[mappedPropertyName] = valueToSet;
      }
    });

    return prev.concat(newInstanceOfTargetClass);
  }, []);
};


function throwErrorIfInputIsInvalid(val: any, targetClassInstance: any) {

  if (Array.isArray(val)) {
    if (!objectHasCustomProp(targetClassInstance[EXCEL_METADATA], COLUMN_NUMBERS)) {
      throw new Error(`When setting value without headers please use 'columnNumber' property of @excelColumn decorator.`);
    }
    return;
  }

  if (isObject(val) && !objectHasCustomProp(val, 'headers')) {
    throw new Error(`Please provide 'headers' property in the values.`)
  }

}