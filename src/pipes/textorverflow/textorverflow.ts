import { Pipe, PipeTransform } from '@angular/core';

/**
 * 文本溢出替代
 */
@Pipe({
  name: 'textorverflow',
})
export class TextorverflowPipe implements PipeTransform {
/**
 * 文本溢出替代
 */
  transform(value: string, params:any) {
    let maxlen:number = Number.parseInt(params);
    if(maxlen>3){
      let result:string = '';
      for(let i=0;i<value.length;i++){
        let onechar:string = value.charAt(i);
        result += onechar;
        if(maxlen>1){
          if(onechar.toLowerCase()!=onechar){
            maxlen = maxlen -2;
          }else{
            maxlen = maxlen -1;
          }
        }else{
          break;
        }
      }
      if(result.length!=value.length)
        return result+'...';
    }
    return value;
  }
}
