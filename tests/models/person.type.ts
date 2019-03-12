import { excelColumn } from "../../src/decorators/excel-column.decorator";

export class PersonType {

    @excelColumn({header: 'name'})
    name: string;

    @excelColumn({header: 'lastName'})
    lastName: string;

    @excelColumn({header: 'salary'})
    salary: number;

    @excelColumn({header: 'age'})
    age: number;

}