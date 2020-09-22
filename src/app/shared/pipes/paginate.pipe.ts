import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'paginate'
})
export class paginate implements PipeTransform {
    transform(items:any, pageSize: number,pageNumber:number): any[] {
            return items.slice(pageSize*(pageNumber-1),(pageSize*pageNumber));

       
    }
}