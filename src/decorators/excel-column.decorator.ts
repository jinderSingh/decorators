import { isFunction, exists } from '../util-methods';
import { ExcelColumnType } from './../models/excel-column.type';
import { CELL_VALUE_TRANSFORMER, COLUMN_NAMES, COLUMN_NUMBERS, EXCEL_METADATA } from './constants';

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
    const transformers = target[CELL_VALUE_TRANSFORMER] || {};

    const properties = {
      writable: true,
      enumerable: true,
      configurable: true
    }

    throwErrorIfBothArePresent(columnNumber, targetPropertyName);

    if (metadata[COLUMN_NAMES] === undefined) {
      metadata[COLUMN_NAMES] = {};
    }

    if (columnNumber !== undefined && columnNumber !== null) {
      if (metadata[COLUMN_NUMBERS] === undefined) {
        metadata[COLUMN_NUMBERS] = {};
      }

      metadata[COLUMN_NUMBERS][key] = columnNumber;
    }

    metadata[COLUMN_NAMES][key] = targetPropertyName || key;


    if (transformer && isFunction(transformer)) {
      transformers[key] = transformer;
    }

    Object.defineProperty(target, CELL_VALUE_TRANSFORMER, {
      ...properties,
      value: transformers
    });

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
function throwErrorIfBothArePresent(first, second) {

  const bothArePresent = exists(first) && exists(second);

  if (bothArePresent) {
    throw new Error(`Can't use both properties 'targetPropertyName' & 'columnNumber' at same time.`);
  }
}