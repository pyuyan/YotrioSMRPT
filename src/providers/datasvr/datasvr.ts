import { Params } from './../../app/params';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContextData } from '../../app/context';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpService } from "../../service/http";
import { DateScene, DateService } from '../../service/date';
import { debugHelper } from './../../util/helper/debug';

import { DatePipe } from '@angular/common';

/*
连接ESB系统获取数据
*/
@Injectable()
export class DatasvrProvider {

  contextdata: ContextData;

  static token: string = null;
  static logintime: Date = null;

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    public http: HttpClient,
    public platform: Platform,
    public httpServ: HttpService,
    public dateServ: DateService,
  ) {
    //初始化上下文
    this.contextdata = ContextData.Create();
    //设置httpServ请求地址
    this.httpServ.setUrl(Params.ESBPortal);

  }

  /**
   * 获取ESB服务器地址
   */
  private GetESBAddress(): string {
    let str = this.contextdata.GetESBPortal();
    if (str === null) {
      str = "/esbsv";
    }
    if (this.platform.is('mobileweb'))
      str = "/esbsv";
    //let str = "/esbsv";
    return str;
  }

  /**
  * 调用关键业务部门档案API
  */
  CallKeyDeptAPI(): Observable<Object> {
    let currUrl = '';
    currUrl = this.GetESBAddress() + '/getKeyDept/do';
    console.log('Send getKeyDept Request to ' + currUrl);
    return this.http.get(currUrl, { headers: this.headers });
  }

  /**
   * 调用最新更新时间API
   */
  CallTimeMarkAPI(tablename: string): Observable<Object> {
    let currUrl = '';
    currUrl = this.GetESBAddress() + '/getTimeMark/do?tablename=' + tablename;
    console.log('Send getTimeMark Request to ' + currUrl);
    return this.http.get(currUrl, { headers: this.headers });
  }

  /**
   * 调用销售数据查询API
   */
  CallSMReprotDataAPI(year: string): Observable<Object> {
    let currUrl = '';
    currUrl = this.GetESBAddress() + '/getSaleTransferData/do?year=' + year;
    console.log('Send getSaleTransferData Request to ' + currUrl);
    return this.http.get(currUrl, { headers: this.headers });
  }

  /**
   * 调用税务数据API
   * @param beginyear 开始年份 默认今年
   * @param beginmonth 开始月份 默认今年第一个月
   * @param endyear 结束年份 默认今年
   * @param endmonth 结束月份，默认当前月
   */
  CallYearTaxAPI(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {
    const endpoint: string = 'getYearTAX/do';
    let params: any = this.dateServ.setScene(DateScene.TAX).getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    return this.httpServ.get(endpoint, params);
  }

  /**
   * 调用库存数据API
   * @param beginyear 开始年份 默认今年
   * @param beginmonth 开始月份 默认今年第一个月
   * @param endyear 结束年份 默认今年
   * @param endmonth 结束月份，默认当前月
   */
  CallYearInventoryAPI(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {
    const endpoint: string = 'getYearInventory/do';
    let params: any = this.dateServ.setScene(DateScene.INVENTORY).getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    return this.httpServ.get(endpoint, params);
  }

  /**
   * @desc 获取股票投资信息
   * @param periodbegin 开始时间 yyyymmdd e.g. 20180101
   * @param periodend 结束时间 yyyymmdd e.g. 201902028
   */
  CallInvStockAPI(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {
    const endpoint: string = 'getStockInvest/do';
    //获取上个月的数据
    // let dateRange: any = this.dateServ.setScene(DateScene.INVSTOCK).setLastMonth().getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    let dateRange: any = this.dateServ.setScene(DateScene.INVSTOCK).getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    let params: any = this.dateServ.concatDateRange(dateRange);
    return this.httpServ.get(endpoint, params);
  }
  /**
   * @desc 获取股权投资信息
   * @param periodbegin 开始时间 yyyymmdd e.g. 20180101
   * @param periodend 结束时间 yyyymmdd e.g. 201902028
   */
  CallInvRightAPI(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {
    const endpoint: string = 'getStockRightInvest/do';
    //获取上个月的数据
    // let dateRange: any = this.dateServ.setScene(DateScene.INVRIGHT).setLastMonth().getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    let dateRange: any = this.dateServ.setScene(DateScene.INVRIGHT).getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    let params: any = this.dateServ.concatDateRange(dateRange);
    return this.httpServ.get(endpoint, params);
  }

  /**
   * 获取关键业务部门档案信息
   */
  GetKeyDepts(): Promise<Boolean> {
    return this.CallKeyDeptAPI().toPromise().then(
      result => {
        let depts: Array<any> = new Array<any>();
        if (result['KeyDepts']) {
          depts = result['KeyDepts']['KeyDept'];
        }
        return depts;
      }
    ).catch(
      err => {
        return new Array<any>();
      }
    ).then(values => {
      if (values) {
        ContextData.GetKeyDepts().DeptNames.length = 0;
        ContextData.GetKeyDepts().DeptSalingTarget.length = 0;
        values.forEach(value => {
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
  IsNeedUpdate(tablename: string): Promise<Boolean> {
    return this.CallTimeMarkAPI(tablename).toPromise().then(
      result => {
        if (result['MarkDatas']) {
          result = result['MarkDatas']['MarkData'][0]['TimeMark'];
        } else {
          //没有更新值
          result = '0';
        }
        return Number.parseInt(result.toString());
      }
    ).catch(
      err => {
        return 0;
      }
    ).then(value => {
      let markvalue: Number = ContextData.GetTimeMark(tablename);
      if (markvalue < value) {
        ContextData.SetTimeMark(tablename, value);
        return true;
      }
      return false;
    });
  }


  /**
   * 获取销售表格数据
   */
  SyncLastSMReportData(year: string): Promise<Boolean> {
    return this.CallSMReprotDataAPI(year).toPromise().then(
      result => {
        if (result['SOInfos']) {
          result = result['SOInfos']['SOInfo'];
        } else {
          //没有更新值
          result = [];
        }
        return result;
      }
    ).catch(
      err => {
        return null;
      }
    ).then(value => {
      if (value) {
        ContextData.OriginalDatas['TMP_SMTransferData'].DataValue = value;
        ContextData.OriginalDatas['TMP_SMTransferData'].UpdateFlag = {
          homepage: true,
          smreportpage: true
        };
        return true;
      }
      return false;
    });
  }

  /**
   * 同步税务数据到本地
   */
  syncYearTaxData() {

    return this.CallYearTaxAPI().subscribe(res => {
      let tmp_taxData = res['TaxDatas']['TaxData'];
      if (tmp_taxData.length) {
        ContextData.TaxDatas[ContextData.TableName].DataValue = tmp_taxData;
        ContextData.TaxDatas[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

  /**
   * 同步库存数据到本地
   */
  syncYearInventoryData() {
    return this.CallYearInventoryAPI().subscribe(res => {
      let tmp_inventoryData = res['InventoryDatas']['InventoryData'];
      if (tmp_inventoryData.length) {
        ContextData.InventoryDatas[ContextData.TableName].DataValue = tmp_inventoryData;
        ContextData.InventoryDatas[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

  syncInvStockData() {
    return this.CallInvStockAPI().subscribe(res => {
      let tmpData = res['StockInvests']['StockInvest'];
      if (tmpData.length) {
        ContextData.InvestsStock[ContextData.TableName].DataValue = tmpData;
        ContextData.InvestsStock[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

  syncInvRightData() {
    return this.CallInvRightAPI().subscribe(res => {
      let tmpData = res['StockRightInvests']['StockRightInvest'];
      if (tmpData.length) {
        ContextData.InvestsRight[ContextData.TableName].DataValue = tmpData;
        ContextData.InvestsRight[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

}
