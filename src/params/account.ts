import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SmreportPage } from '../pages/smreport/smreport';
import { TaxPage } from '../pages/tax/tax';
import { InventoryPage } from '../pages/inventory/inventory';
import { ManagementPage } from '../pages/management/management';
import { InveststockPage } from './../pages/investstock/investstock';
import { InvestrightPage } from './../pages/investright/investright';
import { ReworkPage } from './../pages/rework/rework';
import { ReportPage } from '../pages/report/report';

/**
 * @desc 用户账号体系参数
 */
export class accountParams {

    //不用考虑对接，hardcode 所有账号
    public static readonly accounts: any = [
        {
            role: '总经理', name: '总经理', mac: '', account: '00100001', password: '123456', org: '', workground: [
                { title: '制造数据中心', component: HomePage },
                { title: '营销数据中心', component: SmreportPage },
                { title: '税务数据中心', component: TaxPage },
                { title: '库存数据中心', component: InventoryPage },
                { title: '经营数据中心', component: ManagementPage },
                { title: '股票投资数据', component: InveststockPage },
                { title: '股权投资数据', component: InvestrightPage },
            ]
        },
        {
            role: '财务', name: '财务总监', mac: '', account: '00200001', password: '123456', org: '', workground: [
                // { title: '制造数据中心', component: HomePage },
                // { title: '营销数据中心', component: SmreportPage },
                { title: '税务数据中心', component: TaxPage },
                { title: '库存数据中心', component: InventoryPage },
                { title: '经营数据中心', component: ManagementPage },
                { title: '股票投资数据', component: InveststockPage },
                { title: '股权投资数据', component: InvestrightPage },
            ]
        },
        {
            role: '制造部', name: '制造一部', mac: '', account: '00300001', password: '123456', org: '1004910239461105', workground: [
                { title: '返修数据分析', component: ReworkPage },
            ]
        },
    ];


}