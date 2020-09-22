import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    includes(item: any, searchText: string, keys: string[]) {
        for(let i = 0; i < keys.length; i++ ) {
            if((item[keys[i]]+'').toLowerCase().includes(searchText))
                return true;
        }
        return false;
    }
    
    transform(items:any, searchText: string, ...keys: string[]): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return this.includes(item, searchText, keys);
        });
    }
}