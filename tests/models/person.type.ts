import { excelColumn } from "../../src/decorators/excel-column.decorator";

export class PersonType {

    @excelColumn({targetPropertyName: 'name'})
    name: string;

    @excelColumn({targetPropertyName: 'lastName'})
    lastName: string;

    @excelColumn({targetPropertyName: 'salary'})
    salary: number;

    @excelColumn({targetPropertyName: 'age'})
    age: number;

    constructor(){}
}