import { Injectable } from '@angular/core';

/**
 * 定义日期的使用场景枚举
 */
export enum DateScene {
    HOME = 'HomePage',
    SMREPORT = 'SMrepoSrtPage',
    TAX = 'TaxPage',
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
    public scene: string = '';
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
        return this.dateRangeSet[scene] || {};
    }

    /**
     * 设置今年开始到现在月份的时间范围 必须先调用 setScene 设置场景值
     */
    public setCurrentYear() {
        this.setDateRange();
    }

    /**
     * 设置去年开始时间范围 必须先调用 setScene 设置场景值
     */
    public setLastYear() {
        this.setDateRange(this.years.lastYear, 1, this.years.lastYear, 12);
    }

    /**
     * 设置前年开始时间范围 必须先调用 setScene 设置场景值
     */
    public setBeforeLastYear() {
        this.setDateRange(this.years.blastYear, 1, this.years.blastYear, 12);
    }


}