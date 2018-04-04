import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
 * 上下文记录存储
*/
@Injectable()
export class ContextData {
  //关键业务部门
  static KeyDepts:any = {
    DeptNames:[],
    DeptSalingTarget:[]
  };
  public static SetKeyDepts(depts:any){
    ContextData.KeyDepts = depts;
  }
  public static GetKeyDepts():any{
    return ContextData.KeyDepts;
  }
  //更新时间戳
  static timemarks:any = {
    'TMP_SMTransferData':0
  }

  static OriginalDatas:any = {
    TMP_SMTransferData:{
      UpdateFlag:{
        homepage:false,
        smreportpage:false
      },
      DataValue:[] 
    },
  }

  /**
   * 设置新时间戳
   * @param tablename 
   * @param timemark 
   */
  public static SetTimeMark(tablename:string,timemark:Number){
    ContextData.timemarks[tablename] = timemark;
    console.log('DataTable '+tablename+' Last Updatetime is '+ContextData.timemarks[tablename]);
  }

  /**
   * 获取时间戳
   * @param tablename 
   * @param timemark 
   */
  public static GetTimeMark(tablename:string):Number{
    return ContextData.timemarks[tablename];
  }


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
