export const excelMetadata = 'EXCEL_TO_OBJECT';

export function excelColumn(targetPropertyName: string) {
  return function(target, key) {
    const metadata = target[excelMetadata] || {};
    metadata[key] = targetPropertyName;

    Object.defineProperty(target, excelMetadata, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: metadata
    });
  };
}

