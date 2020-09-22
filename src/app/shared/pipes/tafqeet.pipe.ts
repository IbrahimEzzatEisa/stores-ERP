import { Pipe, PipeTransform } from "@angular/core";

declare var require: any;
const tafqeet = require('src/assets/scripts/tafqeet');

@Pipe({
    name: 'tafqeet'
})
export class TafqeetPipe implements PipeTransform {

    transform(number: number | string): string {
        return tafqeet(number, true);
    }

}