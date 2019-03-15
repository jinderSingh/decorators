import { EXCEL_HANDLER_METHOD_PARAM } from '../constants/constants';
import { mapParamterValueToObjects } from '../handlers/row-parser.handler';
import { ExcelRowType } from '../models/excel-row.type';
import { hasValue } from '../util-methods';



export function excelToObjectParser(classType: new() => any, headerConfs: ExcelRowType = {}) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }

        const originalMethod = descriptor.value;

        const excelDataDecoratorParamIndex = target[EXCEL_HANDLER_METHOD_PARAM] && target[EXCEL_HANDLER_METHOD_PARAM][key];
        
        
        if (!hasValue(excelDataDecoratorParamIndex)) {
            throw new Error(`Please try to annotate excel parsed data argument with @excelData decorator of method ${key} in class ${target.constructor.name}`);
        }

        descriptor.value = function (...args) {

            const parameterOriginalValue = args[excelDataDecoratorParamIndex];

            arguments[excelDataDecoratorParamIndex] = mapParamterValueToObjects(parameterOriginalValue, classType, headerConfs);

            return originalMethod.apply(this, arguments);
        }

        return descriptor;
    }
}

export function excelData(target: any, key: string, paramIndex: number) {
    if (!target[EXCEL_HANDLER_METHOD_PARAM]) {
        target[EXCEL_HANDLER_METHOD_PARAM] = {};
    }
    target[EXCEL_HANDLER_METHOD_PARAM][key] = paramIndex;
}