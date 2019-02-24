import { excelColumn } from '../decorators/excel-column.decorator';

export class DemoType {

    @excelColumn({targetPropertyName: 'name'})
    private name: string;

    @excelColumn({targetPropertyName: 'pre'})
    private price: number;

    constructor() {}
}
