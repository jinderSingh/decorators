import { getKeyIfValueIsEqualTo, getNestedPropertyValueFromObject, getObjectKeysValues, isObject, objectHasCustomProp } from '../util-methods';
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

      throwErrorIfInputIsInvalid(val, typeInstance);

      const mapper = getValueMapper(val, metadata);

      if (!mapper) {
        return;
      }

      const results = Array.isArray(val) ? val : val.results;
      value = mapValuesToTargetTypeObjects(results, targetClass, mapper);

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
function mapValuesToTargetTypeObjects(results: any[], targetClass: new() => any, mapper: (obj, rows: any[]) => any): any[] {
  return results.reduce((prev, next) => {
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
function getValueMapper(values: any, metadata): (obj, rows: any[]) => any {
  let headers;
  const isValuesTypeOfArray = Array.isArray(values);
  if (isValuesTypeOfArray) {
    headers = getObjectKeysValues(metadata[COLUMN_NUMBERS]);
  } else if (isObject(values)) {
    headers = values.headers;
  } else {
    return;
  }

  const metadataToUse = metadata[isValuesTypeOfArray ? COLUMN_NUMBERS : COLUMN_NAMES];

  return (newInstance, rows: any[]) => {
    headers.forEach((header, index) => {
      const mappedPropertyName = getKeyIfValueIsEqualTo(header, metadataToUse);

      if (mappedPropertyName) {
        const valueIndex = isValuesTypeOfArray ? +metadataToUse[mappedPropertyName] : index;

        const transformer = getNestedPropertyValueFromObject(newInstance[CELL_VALUE_TRANSFORMER], mappedPropertyName);

        let valueToSet = rows[valueIndex];
        
        if (transformer) {
          valueToSet = transformer.call(undefined, valueToSet);
        }
        newInstance[mappedPropertyName] = valueToSet;
      }
    });
  }
}



/**
 * throws expection if input to the setter method is invalid
 * @param val 
 * @param targetClassInstance 
 */
function throwErrorIfInputIsInvalid(val: any, targetClassInstance: any): void {

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