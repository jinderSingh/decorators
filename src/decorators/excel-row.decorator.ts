import { EXCEL_METADATA } from './constants';
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
        const obj = new targetClass();
        const a = obj[EXCEL_METADATA];
        for (const prop in a) {
          if (a[prop]) {
            headers.forEach((val, i) => {
              if (val === obj[EXCEL_METADATA][prop]) {
                obj[prop] = next[i];
              }
            });
          }
        }

        return prev.concat(obj);
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
