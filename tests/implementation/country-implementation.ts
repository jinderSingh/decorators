import { excelRows } from "../../src/decorators/excel-row.decorator";
import { CountryType } from './../models/country.type';

export class CountryImplementation {

    @excelRows(CountryType)
    results: any;


    parseExcel(val: any): void {
        this.results = val;
    }

}