import { excelColumn } from "../../src/decorators/excel-column.decorator";

export class CountryType {

    @excelColumn({ columnNumber: 0, header: 'name' })
    name: string;

    @excelColumn({ columnNumber: 1, header: 'continent' })
    continent: string;

    constructor() {}

}