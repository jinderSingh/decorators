import { CELL_VALUE_TRANSFORMER, EXCEL_METADATA } from './constants';

/**
 * Overrides setter and getter of property
 * @param targetClass class type to which each row should be mapped
 */
export function excelRows<T>(targetClass: new () => T) {
  return function (target: any, key: string) {
    let value = target[key];

    const getter = function () {
      return value;
    };

    const setter = function ({
      headers,
      results
    }) {
      value = mapValuesToTargetTypeObjects(headers, results, targetClass);
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
export function mapValuesToTargetTypeObjects(headers, results, targetClass: new () => any) {
  return results.reduce((prev, next) => {
    const newInstanceOfTargetClass = new targetClass();
    const metadata = newInstanceOfTargetClass[EXCEL_METADATA];

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


/**
 * Returns property key if it's value equal to valueToCompare
 * @param valueToCompare value to compare with
 * @param object
 */
function getKeyIfValueIsEqualTo(valueToCompare, object): string | undefined {

  for (const prop in object) {
    if (object[prop] === valueToCompare) {
      return prop;
    }
  }

  return undefined;
}