import { excelColumn } from "../../src/decorators/excel-column.decorator";

export class CountryType {

    @excelColumn({ columnNumber: 0, targetPropertyName: 'name' })
    name: string;

    @excelColumn({ columnNumber: 1, targetPropertyName: 'continent' })
    continent: string;

    constructor() {}

}