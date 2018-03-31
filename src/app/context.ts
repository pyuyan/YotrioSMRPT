import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
 * 上下文记录存储
*/
@Injectable()
export class ContextData {

  static instance:ContextData;

  static inited:boolean = false;

  static sqlite:SQLite;

  public static SetSQLite(sqliteobj:SQLite){
      this.sqlite = sqliteobj;
  }

  public static GetDBObject():SQLiteObject{
    return null;
  }

  //登录上下文
  static logincontext:any = {
    UserCode:'00100001',
    UserName:'00100001',
    OrgID:-1,
    OrgCode:'001',
    OrgName:'',
    UserPass:'123456',
    DeptID:'',
    DeptCode:'',
    DeptName:'',
    Location:'',
    LocationName:'',
    Token:''
  }

  public static Create(){
    if(!ContextData.instance)
       ContextData.instance = new ContextData();
    return ContextData.instance;
  }

  static rightcontext:Array<any> = new Array<any>();

  static originalData:any = null;

  /**
   * 初始化上下文
   */
  public static InitContextData() {
    ContextData.logincontext.Token = '';

    ContextData.inited = true;
  }

  //服务器地址
  static ESBPortal:string = null;

  SetESBPortal(url:string){
    ContextData.ESBPortal = url;
  }

  GetESBPortal():any{
    return ContextData.ESBPortal;
  }

  GetRightContext():any{
    return ContextData.rightcontext;
  }

  SetRightContext(valueobj:any){
    ContextData.rightcontext=valueobj;
  }

  SetLoginContext(valueobj:any){
    ContextData.logincontext = valueobj;
  }

  GetLoginContext():any{
    return ContextData.logincontext;
  }

  ClearLoginContext(){

      // this.logincontext.UserCode='';
      // this.logincontext.UserName='';
      // this.logincontext.OrgID=-1;
      // this.logincontext.OrgCode='';
      // this.logincontext.OrgName='';
      ContextData.logincontext.UserPass='';
      ContextData.logincontext.DeptID='';
      ContextData.logincontext.DeptCode='';
      ContextData.logincontext.DeptName='';
      ContextData.logincontext.Location='';
      ContextData.logincontext.LocationName='';
      ContextData.logincontext.Token='';

  }

}
