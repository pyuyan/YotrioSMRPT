import { Observable } from 'rxjs';
import { HttpClient,HttpRequest,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ContextData } from '../../app/context';
import { Platform } from 'ionic-angular/platform/platform';

/*
U9系统登录登出服务操作
*/
@Injectable()
export class LoginsvrProvider {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  contextdata:ContextData;

  constructor(public http: HttpClient,
              public storage: Storage,
              public platform:Platform) {
      //初始化上下文
      this.contextdata = ContextData.Create();
  }

  /**
   * 获取ESB服务器地址
   */
  private GetESBAddress():string{
    let str = this.contextdata.GetESBPortal();
    if(str===null){
      str = "/esbsv";
    }
    if(this.platform.is('mobileweb'))
      str = "/esbsv";
    console.log(str);
    console.log(this.platform);
    return str;
  }

  /*
  登录U9系统
  */
  doLogin(orgCode:string,orgID:string,loginusercode:string,passWord:string):Observable<Object>{
    let currUrl = '';
    let requestbody = {
      OrgCode:orgCode,
      OrgID:orgID,
      loginUserCode:loginusercode,
      password:passWord
   }
    currUrl = this.GetESBAddress() +'/u9login/Do';
    //console.log('Send Login Request to '+currUrl); 
    return this.http.post(currUrl,requestbody,{headers:this.headers});
  }

  /**
   * 获取登录组织信息
   */
  getOrgInfos():Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/getorgs/orgs';
    console.log('Send GetOrg Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }

}
