import { excelToObjectParser } from '../src/decorators/excel-data-handler.decorator';
import { ExcelDataHandlerType } from './implementation/excel-data-handler.type';
import { AddressType } from './models/address.type';


const expectedValues: AddressType[] = [{
        country: 'Spain',
        city: 'Madrid',
        zipCode: '5456',
        floor: 5
    },
    {
        country: 'USA',
        city: 'New York',
        zipCode: '56a6a',
        floor: 2
    },
    {
        country: 'Germany',
        city: 'Berlin',
        zipCode: '5a464a',
        floor: 3
    },
    {
        country: 'France',
        city: 'Paris',
        zipCode: '4as454',
        floor: 1
    },
    {
        country: 'UK',
        city: 'London',
        zipCode: 'as646',
        floor: 9
    },
    {
        country: 'Australia',
        city: 'Perth',
        zipCode: '4as464',
        floor: 25
    },
];


const defaultExcelParsedValues = [
    ['USA', '2', '56a6a', 'New York'],
    ['Australia', '25', '4as464', 'Perth'],
    ['UK', '9', 'as646', 'London'],
    ['France', '1', '4as454', 'Paris'],
    ['Germany', '3', '5a464a', 'Berlin'],
    ['Spain', '5', '5456', 'Madrid'],
];

describe('map method argument value to array of objects', () => {


    it('should map excel parsed data to array of objects.', () => {
        const instance = new ExcelDataHandlerType();
        const result = instance.excelDataHandler(defaultExcelParsedValues);
        
        expect(result).toContain(jasmine.objectContaining(expectedValues[0]));;
    });



    it('should throw error if method marked with @excelDataHandler has no @excelData annotated argument', () => {

        const target = {};
        const methodName = 'excelHandler';

        const expectedError = new Error(`Please try to annotate excel parsed data argument with @excelData decorator of method ${methodName} in class ${target.constructor.name}`);
        
        expect(() => excelToObjectParser(AddressType)(target, methodName, {}))
            .toThrow(expectedError);

    });


});