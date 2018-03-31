import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'percent',
})
export class PercentPipe implements PipeTransform {
  /**
   * 小数转百分比显示
   */
  transform(value: string, ...args) {
    return (Number.parseFloat(value)*100).toFixed(2).toString()+' %';
  }
}
