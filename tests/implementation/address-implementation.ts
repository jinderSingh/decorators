import { excelRows } from './../../src/decorators/excel-row.decorator';
import { AddressType } from './../models/address.type';


export class AddressTypeImplementation {


    @excelRows(AddressType)
    public addresses: any;


    parseExcel(val: any): void {
        this.addresses = val;
    }

}