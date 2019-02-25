import { excelColumn } from "../../src/decorators/excel-column.decorator";

export class PersonType {

    @excelColumn({targetPropertyName: 'name'})
    public name: string;

    @excelColumn({targetPropertyName: 'lastName'})
    public lastName: string;

    @excelColumn({targetPropertyName: 'salary'})
    public salary: number;

    @excelColumn({targetPropertyName: 'age'})
    public age: number;

    constructor(){}
}