import { hasValue, isFunction } from '../util-methods';
import { ExcelColumnType } from './../models/excel-column.type';
import { CELL_VALUE_TRANSFORMER, COLUMN_NAMES, COLUMN_NUMBERS, EXCEL_METADATA, PROP } from './constants';

/**
 * Add's metadata to target class type
 * @param targetPropertyName 
 * @param transformer 
 */
export function excelColumn({
  columnNumber,
  targetPropertyName
}: ExcelColumnType, transformer ? : (v) => any) {
  return function (target, key) {
    const metadata = target[EXCEL_METADATA] || {};

    const properties = {
      writable: true,
      enumerable: true,
      configurable: true
    }

    throwErrorIfBothArePresent(columnNumber, targetPropertyName, target);

    if (metadata[COLUMN_NAMES] === undefined) {
      metadata[COLUMN_NAMES] = {};
    }

    if (columnNumber !== undefined && columnNumber !== null) {
      if (metadata[COLUMN_NUMBERS] === undefined) {
        metadata[COLUMN_NUMBERS] = {};
      }

      metadata[COLUMN_NUMBERS][key] = {
        [PROP]: columnNumber,
        [CELL_VALUE_TRANSFORMER]: transformer && isFunction(transformer) ? transformer : null
      };
    }

    metadata[COLUMN_NAMES][key] = {
      [PROP]: targetPropertyName || key,
      [CELL_VALUE_TRANSFORMER]: transformer && isFunction(transformer) ? transformer : null
    };

    Object.defineProperty(target, EXCEL_METADATA, {
      ...properties,
      value: metadata
    });
  };
}


/**
 * throws exception, if both arguments values are present
 * @param first 
 * @param second 
 */
function throwErrorIfBothArePresent(first, second, type: any) {

  const bothArePresent = hasValue(first) && hasValue(second);

  if (bothArePresent) {
    throw new Error(`Can't use both properties 'targetPropertyName' & 'columnNumber' at same time in ${type && type.constructor.name}.`);
  }
}