import { CELL_VALUE_TRANSFORMER, EXCEL_METADATA } from './constants';
export function excelRows < T > (targetClass: new() => T) {
  return function (target: any, key: string) {
    let value = target[key];

    const getter = function () {
      return value;
    };

    const setter = function ({
      headers,
      results
    }) {
      value = results.reduce((prev, next) => {
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

function getKeyIfValueIsEqualTo(valueToCompare, metadata): string | undefined {

  for (const prop in metadata) {
    if (metadata[prop] === valueToCompare) {
      return prop;
    }
  }

  return undefined;
}