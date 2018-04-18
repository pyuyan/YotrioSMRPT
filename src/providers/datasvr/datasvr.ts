import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContextData } from '../../app/context';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

/*
连接ESB系统获取数据
*/
@Injectable()
export class DatasvrProvider {

  contextdata:ContextData;

  static token:string = null;
  static logintime:Date = null;

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(public http: HttpClient,
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
    //let str = "/esbsv";
    return str;
  }  

   /**
   * 调用关键业务部门档案API
   */
  CallKeyDeptAPI():Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/getKeyDept/do';
    console.log('Send getKeyDept Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }  
  
  /**
   * 调用最新更新时间API
   */
  CallTimeMarkAPI(tablename:string):Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/getTimeMark/do?tablename='+tablename;
    console.log('Send getTimeMark Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }  

  /**
   * 调用销售数据查询API
   */
  CallSMReprotDataAPI(year:string):Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/getSaleTransferData/do?year='+year;
    console.log('Send getSaleTransferData Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }    
  
  /**
   * 获取关键业务部门档案信息
   */
  GetKeyDepts():Promise<Boolean>{
    return this.CallKeyDeptAPI().toPromise().then(
      result=>{
        let depts:Array<any> = new Array<any>();
        if(result['KeyDepts']){
          depts = result['KeyDepts']['KeyDept'];
        }
        return depts;
      }
    ).catch(
      err=>{
        return new Array<any>();
      }
    ).then(values=>{
      if(values){
        ContextData.GetKeyDepts().DeptNames.length = 0;
        ContextData.GetKeyDepts().DeptSalingTarget.length = 0;
        values.forEach(value=>{
          ContextData.GetKeyDepts().DeptNames.push(value['Name']);
          ContextData.GetKeyDepts().DeptSalingTarget.push(Math.round(value['TargetMoney']));
        });
        return true;
      }
      return false;
    });
  }

  /**
   * 判断是否需要更新
   */
  IsNeedUpdate(tablename:string):Promise<Boolean>{
    return this.CallTimeMarkAPI(tablename).toPromise().then(
      result=>{
        if(result['MarkDatas']){
          result = result['MarkDatas']['MarkData'][0]['TimeMark'];
        }else{
          //没有更新值
          result = '0';         
        }
        return Number.parseInt(result.toString());
      }
    ).catch(
      err=>{
        return 0;
      }
    ).then(value=>{
      let markvalue:Number = ContextData.GetTimeMark(tablename);
      if(markvalue<value){
        ContextData.SetTimeMark(tablename,value);
        return true;
      }
      return false;
    });
  }


  /**
   * 获取销售表格数据
   */
  SyncLastSMReportData(year:string):Promise<Boolean>{
    return this.CallSMReprotDataAPI(year).toPromise().then(
      result=>{
        if(result['SOInfos']){
          result = result['SOInfos']['SOInfo'];
        }else{
          //没有更新值
          result = [];         
        }
        return result;
      }
    ).catch(
      err=>{
        return null;
      }
    ).then(value=>{
      if(value){
        ContextData.OriginalDatas['TMP_SMTransferData'].DataValue = value;
        ContextData.OriginalDatas['TMP_SMTransferData'].UpdateFlag = {        
          homepage:true,
          smreportpage:true
        };
        return true;
      }
      return false;
    });
  }


}
