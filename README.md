# Decorators
Decorators to parse ``XLSX`` npm excel library read operation result to Object.

<hr>

## Installation

*  ``npm i excel-to-object-decorator --save``


<hr>

## Example
[Angular project example](https://github.com/jinderSingh/decorator-demo)

<hr>

## Decorators implementation

- <ins>@excelColumn</ins>
  
  * @excelColumn accepts 2 arguments. First argument is type of ``ExcelColumnType`` and second one is a ``transformer`` function. This decorator sets metadata to the types. 
    

    ``ExcelColumnType``
    <p style="color: red">!Important¡ both properties `targetPropertyName` && `columnNumber` can not be used at same time. </p>
    
    - **targetPropertyName**: is used to map header properties from parsed excel to the class type properties. 
    
        This property is case sensative, if header from excel is ``name`` and value of this property is ``Name``, in this case there is no mapping.

        ***Use this property only if there are headers in excel file otherwise use columnNumber.***

    ```typescript
    
        const parsedExcel = [
            ['Name', 'LastName', 'age', 'salary'], // Headers from excels.
            ['Jennifer', 'Wisozk', 25, 30000],
            ['Danyka', 'Renner', 30, 40000],
        ]

        class Person {
            @excelColumn({targetPropertyName: 'Name'})
            name: string;
        }

    ```

    - **columnNumber**: is used to map rows[index] to the class property. This property is used as ``index``.

        To get little bit of performance, use this property over ``targetPropertyName`` if there are no headers in excel file or if there are slice them. 

    ```typescript
    
        const parsedExcel = [
            ['Jennifer', 'Wisozk', 25, 30000],
            ['Danyka', 'Renner', 30, 40000],
        ]; // there are no headers

        class Person {
            @excelColumn({columnNumber: 1})
            lastName: string;

            @excelColumn({columnNumber: 3})
            salary: number;

            @excelColumn({columnNumber: 2})
            age: number;
        }

    ```

    ``transformer``
    - Transformer should be type of function with one argument as input. Gives posibility to manipulate value before setting it to the object property.

    ```typescript
    
        const parsedExcel = [
            ['Jennifer', 'Wisozk', 25, 30000],
            ['Danyka', 'Renner', 30, 40000],
        ];

        class Person {
            @excelColumn({columnNumber: 1}, val => val.toLowerCase())
            lastName: string; // value should be 'wisozk' for first row

            @excelColumn({columnNumber: 3}, val => +val * 5)
            salary: number; // value should be 150000 for first row

            @excelColumn({columnNumber: 2})
            age: number;
        }

    ```
- <ins>@excelRows</ins>
    * @excelRows(ClassType) uses input class type to map rows to object. Overrides setter of property which has been marked with this decorator.

    ```typescript
    
    class ExcelReader {

        @excelRows(Person)
        results: any; // setter of this property is overriden by @excelRows


        readFile(): void  {
            this.results = [
                ['Jennifer', 'Wisozk', 25, 30000],
                ['Danyka', 'Renner', 30, 40000],
            ];
        }

    }
    
    ```

<hr>

## Usage Example

```typescript
    class ResultClass{

        @excelColumn({targetPropertyName: 'label'})
        private name;

        @excelColumn({targetPropetyName: 'price'})
        private total;
    }


    class ResultClassImpl {

        @excelRows(ResultClass)
        private results: any;

        /** 
        *  SOURCE GITHUB REPO: https://github.com/SheetJS/js-xlsx/tree/1eb1ec985a640b71c5b5bbe006e240f45cf239ab/demos/angular2
        **/
        readExcelFileWithHeaders(evt): void {
            const target: DataTransfer = <DataTransfer>(evt.target);
            if (target.files.length !== 1) throw new Error('Cannot use multiple files');
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                const data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
                this.results = {headers: data[0], results: data.slice(1)}
            };
            reader.readAsBinaryString(target.files[0]);
        }

    }



    class Example {
        @excelColumn({columNumber: 1}, val => val.toLowerCase())
        private name;

        @excelColumn({columnNumber: 10}, val => val * 10)
        private total;
    }


    class ExampleClassImpl {

        @excelRows(Example)
        private results: any;

        /** 
        *  SOURCE GITHUB REPO: https://github.com/SheetJS/js-xlsx/tree/1eb1ec985a640b71c5b5bbe006e240f45cf239ab/demos/angular2
        **/
        readExcelFileWithoutHeaders(evt): void {
            const target: DataTransfer = <DataTransfer>(evt.target);
            if (target.files.length !== 1) throw new Error('Cannot use multiple files');
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                const data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));

                // excel file should not contain headers or slice the result array to remove headers row
                this.results = data
            };
            reader.readAsBinaryString(target.files[0]);
        }

    }


```
