import { urlParams } from "./../../params/url";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContextData } from '../../app/context';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpService } from "../../service/http";
import { DateScene, DateService } from '../../service/date';
import { debugHelper } from './../../util/helper/debug';

import { DatePipe } from '@angular/common';
import { timeParams } from './../../params/time';

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
    this.httpServ.setUrl(urlParams.ESBPortal);

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
    currUrl = this.GetESBAddress() + urlParams.common.endpoint.keyDepartment;
    console.log('Send getKeyDept Request to ' + currUrl);
    return this.http.get(currUrl, { headers: this.headers });
  }

  /**
   * 调用最新更新时间API
   */
  CallTimeMarkAPI(tablename: string): Observable<Object> {
    let currUrl = '';
    currUrl = this.GetESBAddress() + urlParams.common.endpoint.timeMark + '?tablename=' + tablename;
    console.log('Send getTimeMark Request to ' + currUrl);
    return this.http.get(currUrl, { headers: this.headers });
  }

  /**
   * 调用销售数据查询API
   */
  CallSMReprotDataAPI(year: string): Observable<Object> {
    let currUrl = '';
    currUrl = this.GetESBAddress() + urlParams.common.endpoint.SaleTransferData + '?year=' + year;
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
    const endpoint: string = urlParams.common.endpoint.yearTax;
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
    const endpoint: string = urlParams.common.endpoint.yearInventory;
    const dateScene = DateScene.INVENTORY;
    let params: any = {};

    this.dateServ.setScene(dateScene);
    if (this.dateServ.getDateRange(dateScene)) {
      params = this.dateServ.getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    } else {
      //获取上个月的数据
      params = this.dateServ.setMonthPeriod().getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    }

    return this.httpServ.get(endpoint, params);
  }

  /**
   * @desc 获取股票投资信息
   * @param beginyear 开始年份 默认今年
   * @param beginmonth 开始月份 默认今年第一个月
   * @param endyear 结束年份 默认今年
   * @param endmonth 结束月份，默认当前月
   */
  CallInvStockAPI(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {
    const endpoint: string = urlParams.common.endpoint.stockInvest;
    const dateScene = DateScene.INVSTOCK;
    let params: any = {};
    this.dateServ.setScene(dateScene);
    if (this.dateServ.getDateRange(dateScene)) {
      params = this.dateServ.getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    } else {
      //获取上个月的数据
      params = this.dateServ.setMonthPeriod().getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    }
    return this.httpServ.get(endpoint, params);
  }
  /**
   * @desc 获取股权投资信息
   * @param beginyear 开始年份 默认今年
   * @param beginmonth 开始月份 默认今年第一个月
   * @param endyear 结束年份 默认今年
   * @param endmonth 结束月份，默认当前月
   */
  CallInvRightAPI(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {
    const endpoint: string = urlParams.common.endpoint.rightInvest;
    const dateScene = DateScene.INVRIGHT;
    let params: any = {};
    this.dateServ.setScene(dateScene);
    if (this.dateServ.getDateRange(dateScene)) {
      params = this.dateServ.getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    } else {
      //获取上个月的数据
      params = this.dateServ.setMonthPeriod().getFilteredDateRange(beginyear, beginmonth, endyear, endmonth);
    }
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
      if (Array.isArray(tmp_taxData)) {
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
      if (Array.isArray(tmp_inventoryData)) {
        ContextData.InventoryDatas[ContextData.TableName].DataValue = tmp_inventoryData;
        ContextData.InventoryDatas[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

  /**
   * 同步股票投资数据到本地
   */
  syncInvStockData() {
    return this.CallInvStockAPI().subscribe(res => {
      let tmpData = res['StockInvests']['StockInvest'];
      if (Array.isArray(tmpData)) {
        ContextData.InvestsStock[ContextData.TableName].DataValue = tmpData;
        ContextData.InvestsStock[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

  /**
   * 同步股权投资数据到本地
   */
  syncInvRightData() {
    return this.CallInvRightAPI().subscribe(res => {
      let tmpData = res['StockRightInvests']['StockRightInvest'];
      if (Array.isArray(tmpData)) {
        ContextData.InvestsRight[ContextData.TableName].DataValue = tmpData;
        ContextData.InvestsRight[ContextData.TableName].UpdateFlag = true;
      }
    });
  }

}
