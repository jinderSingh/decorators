# Decorators
Decorators to parse ``XLSX`` npm excel library read operation result to TypeScript class.

## Example

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
        readExcelFile(evt): void {
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
        readExcelFile(evt): void {
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

                // excel file should not contain headers or slice result array to remove headers row
                this.results = data
            };
            reader.readAsBinaryString(target.files[0]);
        }

    }


```

## Example project
[Example project](https://github.com/jinderSingh/decorator-demo)
