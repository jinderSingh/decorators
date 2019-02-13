import { EXCEL_METADATA, ORIGINAL_VALUE } from './constants';

export function excelColumn(targetPropertyName: string, transformer: Function) {
  return function (target, key) {
    const originalValue = target[key];
    const metadata = target[EXCEL_METADATA] || {};
    const properties = {
      writable: true,
      enumerable: true,
      configurable: true
    }
    metadata[key] = targetPropertyName;

    if (transformer && typeof transformer === 'function') {

      Object.defineProperty(target, ORIGINAL_VALUE, {
        ...properties,
        value: originalValue
      })

      if (delete target[key]) {
        Object.defineProperty(target, key, {
          ...properties,
          value: transformer.call(undefined, originalValue)
        })
      }
    }

    Object.defineProperty(target, EXCEL_METADATA, {
      ...properties,
      value: metadata
    });
  };
}