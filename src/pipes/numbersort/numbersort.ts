import { Pipe, PipeTransform } from '@angular/core';

/**
 * 数值排序
 */
@Pipe({
  name: 'numbersort',
})
export class NumbersortPipe implements PipeTransform {

transform(array: Array<any>, field:string): Array<any> {
  return array.sort(function(a, b){
    if(Number.parseFloat(a[field]) < Number.parseFloat(b[field])){
        return -1;
    }
    else if( Number.parseFloat(a[field]) > Number.parseFloat(b[field])){
        return 1;
    }
    else{
        return 0;
    }
  });
}
}
