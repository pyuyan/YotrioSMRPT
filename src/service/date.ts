import { Injectable } from '@angular/core';
import { timeParams } from '../params/time';

/**
 * 定义日期的使用场景枚举
 */
export enum DateScene {
    HOME = 'HomePage',
    SMREPORT = 'SMrepoSrtPage',
    TAX = 'TaxPage',
    INVENTORY = 'Inventory',
    MANAGEMENT = 'Management',
    INVSTOCK = 'InvestStock',
    INVRIGHT = 'InvestRight',
    REWORK = 'Rework',
}

export interface dateRange {
    beginyear: number;
    beginmonth: number;
    beginday?: number;
    endyear: number;
    endmonth: number;
    endday?: number;
}

/**
 * 日期范围参数
 */
@Injectable()
export class DateService {
    private dateObj: any;
    /**
     * 当前月份
     */
    public currentMonth: number;

    /**
     * 涉及的近几年 e.g. 只是今年，去年，前年
     */
    public years: any = {
        currentYear: 0,
        lastYear: 0,
        blastYear: 0
    };

    /**
     * 日期使用场景
     */
    public scene: any;
    /**
     * 日期每个场景下的值集合
     */
    public dateRangeSet: any = {};

    constructor() {
        this.dateObj = new Date();
        this.currentMonth = this.dateObj.getMonth() + 1;
        let currentYear = this.dateObj.getFullYear();
        this.years = {
            currentYear: currentYear,
            lastYear: currentYear - 1,
            blastYear: currentYear - 2
        };
    }

    public setScene(scene: DateScene) {
        this.scene = scene;
        return this;
    }

    public setDateRange(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {

        let year = this.dateObj.getFullYear();

        let params: any = {
            beginyear: beginyear == 0 ? year : beginyear,
            beginmonth: beginmonth,
            endyear: endyear == 0 ? year : endyear,
            endmonth: endmonth == 0 ? this.dateObj.getMonth() + 1 : endmonth,
        };

        this.dateRangeSet[this.scene] = params;
        return this;
    }

    public getDateRange(scene: DateScene) {
        return this.dateRangeSet[scene] || false;
    }

    /**
     * 设置当月的时间范围 必须先调用 setScene 设置场景值
     */
    public setCurrentMonth() {
        let currentYear = this.years.currentYear;
        // let endYear = this.years.currentYear, endMonth = this.currentMonth;

        // if (this.currentMonth == 12) {
        //     endYear = Number(endYear) + 1;
        //     endMonth = 1;
        // }

        return this.setDateRange(currentYear, this.currentMonth, currentYear, this.currentMonth);
    }

    /**
     * 设置上个月的时间范围 必须先调用 setScene 设置场景值
     */
    public setLastMonth() {
        return this.setRealMonthPeriod(1);
    }

    /**
     * 设置上上个月的时间范围 必须先调用 setScene 设置场景值
     */
    public setBeforeLastMonth() {
        return this.setRealMonthPeriod(2);
    }

    private setRealMonthPeriod(inter: number) {
        let beginYear = this.years.currentYear, beginMonth = 0;

        if (this.currentMonth == 1) {
            beginYear = Number(beginYear) - 1;
            beginMonth = 12 - inter + 1;
        } else {
            beginMonth = Number(this.currentMonth) - inter;
        }
        return this.setDateRange(beginYear, beginMonth, beginYear, beginMonth);
    }

    /**
     * 设置今年开始到现在月份的时间范围 必须先调用 setScene 设置场景值
     */
    public setCurrentYear() {
        return this.setDateRange();
    }

    /**
     * 设置去年开始时间范围 必须先调用 setScene 设置场景值
     */
    public setLastYear() {
        return this.setDateRange(this.years.lastYear, 1, this.years.lastYear, 12);
    }

    /**
     * 设置前年开始时间范围 必须先调用 setScene 设置场景值
     */
    public setBeforeLastYear() {
        return this.setDateRange(this.years.blastYear, 1, this.years.blastYear, 12);
    }

    public clean(scene: DateScene) {
        this.dateRangeSet[scene] = {};
    }

    /**
     * 获取过滤后的日期区间
     */
    public getFilteredDateRange(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0): dateRange {

        if (beginyear <= 0 || endyear <= 0 || endmonth <= 0 || beginmonth <= 0) {
            let years = this.years;
            //默认取值为今年到现在的月份的数据
            beginyear = years.currentYear;
            beginmonth = beginmonth;
            endyear = years.currentYear;
            endmonth = this.currentMonth;

            let dateRange = this.getDateRange(this.scene);
            if (Object.keys(dateRange).length) {
                beginyear = dateRange.beginyear;
                beginmonth = dateRange.beginmonth;
                endyear = dateRange.endyear;
                endmonth = dateRange.endmonth;
            }
        }

        return {
            beginyear: beginyear,
            beginmonth: beginmonth,
            endyear: endyear,
            endmonth: endmonth,
        };
    }

    /**
     * 
     * @param range 
     * @note 由于是按月统计，目前是 20180300-20180400 代表是3月范围
     */
    public concatDateRange(range: dateRange) {
        let beginMonth = range.beginmonth.toString();
        let endMonth = range.endmonth.toString();
        beginMonth = beginMonth.length == 1 ? '0' + beginMonth : beginMonth;
        endMonth = endMonth.length == 1 ? '0' + endMonth : endMonth;
        let beginDay = range.beginday ? range.beginday : '00',
            endDay = range.endday ? range.endday : '00';
        return {
            periodbegin: range.beginyear.toString() + beginMonth + beginDay,
            periodend: range.endyear.toString() + endMonth + endDay
        }
    }

    /**
     * @desc 确保不受每月上传数据时间影响，始终有数据
     * @note 不好的实践，不符合开闭原则。。。有时间优化一下
     */
    public setMonthPeriod() {
        let today = this.dateObj.getDate();
        let uploadDate: number = 0;
        switch (this.scene) {
            case DateScene.INVENTORY:
                uploadDate = timeParams.inventory['uploadDate'];
                break;
            case DateScene.INVSTOCK:
                uploadDate = timeParams.investstock['uploadDate'];
                break;
            case DateScene.INVRIGHT:
                uploadDate = timeParams.investright['uploadDate'];
                break;
            case DateScene.MANAGEMENT:
                uploadDate = timeParams.management['uploadDate'];
                break;
            case DateScene.TAX:
                uploadDate = timeParams.tax['uploadDate'];
                break;
            default:
                break;
        }

        if (today < uploadDate) {
            this.setBeforeLastMonth();
        } else {
            this.setLastMonth();
        }
        return this;
    }
}