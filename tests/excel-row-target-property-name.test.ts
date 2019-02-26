import { PersonImplementation } from './implementation/person-implementation';
import { PersonType } from './models/person.type';


const defaultValues: PersonType[] = [{
    name: 'John',
        salary: 38000,    
        lastName: 'Doe',
        age: 25
    },
    {
        name: 'Maria',
        salary: 60000,
        lastName: '',
        age: 30
    },
    {
        name: 'Alex',
        salary: 35000,
        lastName: 'Lebsack',
        age: 22
    },
    {
        name: 'Margaretta',
        salary: 30000,
        lastName: 'Lind',
        age: 26
    },
    {
        name: 'Cali',
        salary: 60000,
        lastName: 'Heller',
        age: 40
    },
    {
        name: 'Norwood',
        salary: 30000,
        lastName: 'Reynolds',
        age: 20
    },
];


const defaultExcelParsedValues = [
    ["John", 38000, "Doe", 25],
    ["Maria", 60000, "", 30],
    ["Alex", 35000, "Lebsack", 22],
    ["Margaretta", 30000, "Lind", 26],
    ["Cali", 60000, "Heller", 40],
    ["Norwood", 30000, "Reynolds", 20],
]



xdescribe('map excel parsed data to array of objects', function () {
    it('should map result to object with headers', function () {

        const personImpl = new PersonImplementation();

        personImpl.parseExcel({
            headers: ['name', 'salary', 'lastName', 'age'],
            results: defaultExcelParsedValues
        });

        expect(personImpl.excelParsedResults).toBeTruthy();

        expect(personImpl.excelParsedResults).toContain(jasmine.objectContaining(defaultValues[0]));
    });



    it('should throw error if headers property is not present', function () {

        const personImpl = new PersonImplementation();
        const expectedError = new Error(`Please provide 'headers' property in the values.`);

        expect(personImpl.parseExcel.bind(personImpl,({
            results: defaultExcelParsedValues
        })))
            .toThrow(expectedError);
    });

});