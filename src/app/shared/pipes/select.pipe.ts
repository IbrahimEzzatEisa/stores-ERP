import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'select'
})
export class SelectPipe implements PipeTransform {
  transform(id: string, inputKey: string, displayKey: string, items: any[]): any {
    if (!id || !inputKey || !items || !displayKey) {
      return '';
    }
    const selectedItem = items.find(item => item[inputKey] == id)
    if(!selectedItem)
      return '';
    return selectedItem[displayKey];
  }
}