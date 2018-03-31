import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ThousandsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'thousands',
})
export class ThousandsPipe implements PipeTransform {
  /**
   * 增加千分位
   */
  transform(value: string, ...args) {
    return Math.round(Number.parseFloat(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
