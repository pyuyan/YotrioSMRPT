import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
连接ESB系统获取数据
*/
@Injectable()
export class DatasvrProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DatasvrProvider Provider');
  }

}
