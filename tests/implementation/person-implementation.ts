import { excelRows } from './../../src/decorators/excel-row.decorator';
import { PersonType } from './../models/person.type';
export class PersonImplementation {

    @excelRows(PersonType, {headerRowIndex: 0})
    public excelParsedResults: any;
    

    @excelRows(PersonType)
    public excelWithoutHeadersError: any;


    public parseExcel(val: any[][]): void {
        this.excelParsedResults = val;
    }

    public invokeError(val: any[][]) {
        this.excelWithoutHeadersError = val;
    }

}