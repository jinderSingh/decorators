import { objectToExcel } from './../src/object-to-excel';
import { AddressType } from './models/address.type';
import { ModelWithoutMetadata } from './models/model-without-metadata.type';
import { PersonType } from './models/person.type';

describe('convert array of objects to array of arrays', () => {

    it('should convert array of objects to array of arrays with first row as headers using targetPropertyName', () => {
        const valuesToConvert: PersonType[] = [{
                name: 'Shirley',
                lastName: 'Harber',
                age: 25,
                salary: 30000
            },
            {
                name: 'Chesley',
                lastName: 'Welch',
                age: 29,
                salary: 40000
            },
            {
                name: 'Luna',
                lastName: 'Stroman',
                age: 18,
                salary: 35000
            },
        ];

        const expectedResults = [
            ['name', 'lastName', 'salary', 'age'],
            ['Shirley', 'Harber', 30000, 25],
            ['Chesley', 'Welch', 40000, 29],
            ['Luna', 'Stroman', 35000, 18],
        ];

        const result = objectToExcel < PersonType > (PersonType)(valuesToConvert as any);

        expect(result).toEqual(expectedResults);
    });

    it('should convert array of objects to array of arrays without headers using columnNumber', () => {
        const valuesToConvert: AddressType[] = [{
                city: 'Madrid',
                country: 'Spain',
                floor: 2,
                zipCode: '2545'
            },
            {
                city: 'Berlin',
                country: 'Germany',
                floor: 5,
                zipCode: '65648'
            },
            {
                city: 'London',
                country: 'UK',
                floor: 10,
                zipCode: '566598'
            },
        ];

        const expectedResults = [
            ['Spain', 2, '2545', 'Madrid'],
            ['Germany', 5, '65648', 'Berlin'],
            ['UK', 10, '566598', 'London'],
        ];


        const result = objectToExcel < AddressType > (AddressType)(valuesToConvert as any);

        expect(result).toEqual(expectedResults);
    });


    it('should fail if there is no metadata on class type', () => {
        const instance = new ModelWithoutMetadata();
        const expectedError = new Error(`Metadata not found on class ${instance.constructor.name}. Please annotate class type properties with @excelColumn decorator.`);

        expect(() => objectToExcel(ModelWithoutMetadata))
        .toThrow(expectedError)

    })

})