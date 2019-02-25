import { excelRows } from './../../src/decorators/excel-row.decorator';
import { PersonType } from './../models/person.type';
export class PersonImplementation {

    @excelRows(PersonType)
    public excelParsedResults: any;
    

    public parseExcel(val: any): void {
        this.excelParsedResults = val;
    }

}