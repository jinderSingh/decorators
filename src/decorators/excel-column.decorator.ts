import { CELL_VALUE_TRANSFORMER, EXCEL_METADATA } from './constants';

export function excelColumn(targetPropertyName: string, transformer ? : (v) => any) {
  return function (target, key) {
    const metadata = target[EXCEL_METADATA] || {};
    const transformers = target[CELL_VALUE_TRANSFORMER] || {};

    const properties = {
      writable: true,
      enumerable: true,
      configurable: true
    }
    metadata[key] = targetPropertyName;

    if (transformer && typeof transformer === 'function') {
      transformers[key] = transformer;
    }

    Object.defineProperty(target, CELL_VALUE_TRANSFORMER, {
      ...properties,
      value: transformer
    });

    Object.defineProperty(target, EXCEL_METADATA, {
      ...properties,
      value: metadata
    });
  };
}