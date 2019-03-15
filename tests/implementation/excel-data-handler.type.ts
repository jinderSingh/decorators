import { excelData, excelToObjectParser } from './../../src/decorators/excel-data-handler.decorator';
import { AddressType } from './../models/address.type';

export class ExcelDataHandlerType {

    @excelToObjectParser(AddressType)
    excelDataHandler(@excelData data: any) {
        return data;
    }

}