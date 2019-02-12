import { excelColumn } from '../decorators/excel-column.decorator';

export class TestType {

    @excelColumn('name')
    private name: string;

    @excelColumn('pre')
    private price: number;

    constructor() {}
}
