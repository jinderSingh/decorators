import { AddressTypeImplementation } from './implementation/address-implementation';
import { AddressType } from './models/address.type';


const defaultValues: AddressType[] = [{
        country: 'Spain',
        city: 'Madrid',
        zipCode: '5456'
    },
    {
        country: 'USA',
            city: 'New York',
            zipCode: '56a6a'
    },
    {
        country: 'Germany',
        city: 'Berlin',
        zipCode: '5a464a'
    },
    {
        country: 'France',
        city: 'Paris',
        zipCode: '4as454'
    },
    {
        country: 'UK',
        city: 'London',
        zipCode: 'as646'
    },
    {
        country: 'Australia',
        city: 'Perth',
        zipCode: '4as464'
    },
];


const defaultExcelParsedValues: string[][] = [
    ["USA", '56a6a', 'New York'],
    ["Australia", '4as464', 'Perth'],
    ["UK", 'as646', 'London'],
    ["France", '4as454', 'Paris'],
    ["Germany", '5a464a', 'Berlin'],
    ["Spain", '5456', 'Madrid'],
]


describe('map excel parsed data to array of objects', function () {
    it('should map result to object using column numbers as headers', function () {

        const addressImpl = new AddressTypeImplementation();

        addressImpl.parseExcel(defaultExcelParsedValues);


        expect(addressImpl.addresses).toBeTruthy();

        expect(addressImpl.addresses).toContain(jasmine.objectContaining(defaultValues[0]));
    });

});