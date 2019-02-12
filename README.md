# Decorators
Decorators to parse ``XLSX`` npm excel library read operation result to TypeScript class.

## Example

````
    class ResultClass{

        @excelColumn('label')
        private name;

        @excelColumn('price')
        private total;
    }


    class Demo {

        @excelRows(ResultClass)
        private results: any;

        /** 
        *  SOURCE GITHUB REPO: https://github.com/SheetJS/js-xlsx/tree/1eb1ec985a640b71c5b5bbe006e240f45cf239ab/demos/angular2
        **/
        readExcelFile(file): void {
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
                this.results = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
            };
            reader.readAsBinaryString(target.files[0]);
        }

    }

```
