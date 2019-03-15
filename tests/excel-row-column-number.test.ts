import { excelColumn } from '../src/decorators/excel-column.decorator';
import { AddressTypeImplementation } from './implementation/address-implementation';
import { AddressType } from './models/address.type';


const defaultValues: AddressType[] = [{
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

describe('map excel parsed data to array of objects', function () {
    it('should map result to object using column numbers as headers', function () {

        const addressImpl = new AddressTypeImplementation();

        addressImpl.parseExcel(defaultExcelParsedValues);

        expect(addressImpl.addresses).toBeTruthy();

        expect(addressImpl.addresses)
            .toContain(jasmine.objectContaining(defaultValues[0]));
        
        expect(addressImpl.addresses[0].floor)
            .toEqual(defaultValues[1].floor);
    });


    it('should throw error if both properties (targetPropertyName & columnNumber) are present in @excelColumn', function () {
        const type = {};
        const expectedError = new Error(`Can't use both properties 'targetPropertyName' & 'columnNumber' at same time in ${type.constructor.name}.`);

        expect(function () {
            excelColumn({
                header: 'name',
                columnNumber: 2
            })(type, 'name')
        }).toThrow(expectedError);
    });

});