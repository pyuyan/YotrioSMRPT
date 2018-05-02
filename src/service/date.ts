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

    /**
     * 日期使用场景
     */
    public scene: string = '';
    /**
     * 日期每个场景下的值集合
     */
    public dateRangeSet: any = {};

    constructor() { }

    public setScene(scene: DateScene) {
        this.scene = scene;
        return this;
    }

    public setDateRange(beginyear: number = 0, beginmonth: number = 1, endyear: number = 0, endmonth: number = 0) {

        const dateObj = new Date();
        let year = dateObj.getFullYear();

        let params: any = {
            beginyear: beginyear == 0 ? year : beginyear,
            beginmonth: beginmonth,
            endyear: endyear == 0 ? year : endyear,
            endmonth: endmonth == 0 ? dateObj.getMonth() + 1 : endmonth,
        };

        this.dateRangeSet[this.scene] = params;
        return this;
    }

    public getDateRange(scene: DateScene) {
        return this.dateRangeSet[scene] || {};
    }
}