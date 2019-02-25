import { excelColumn } from './../../src/decorators/excel-column.decorator';

export class AddressType {

    @excelColumn({columnNumber: 0})
    country: string;

    @excelColumn({columnNumber: 1})
    zipCode: string;

    @excelColumn({columnNumber: 2})
    city: string;


    constructor(){}

}