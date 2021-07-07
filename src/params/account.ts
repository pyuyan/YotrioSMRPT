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
            role: '总经理', name: '总经理', mac: /*'14:6b:9c:24:66:c6'*/'78:dd:d9:7b:43:1e', account: '001001', password: '123456', org: '', workground: [
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
            role: '财务', name: '财务总监', mac: '14:6b:9c:24:d5:2a', account: '002001', password: '123456', org: '', workground: [
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
            role: '制造部', name: '制造一部', /*mac: '14:6b:9c:24:d2:7e'*/ mac: '', account: '003001', password: '123456', org: '1004910239461105', workground: [
                { title: '返工数据中心', component: ReworkPage },
            ]
        },
        /* {
            role: '测试', name: '模拟器一号', mac: '08:00:27:d5:d5:ec', account: '1110', password: '123456', org: '1004910239461105', workground: [
                { title: '返工数据中心', component: ReworkPage },
                { title: '库存数据中心', component: InventoryPage },
            ]
        },
        {
            role: '测试', name: '测试一号', mac: '', account: '2220', password: '123456', org: '1004910239461105', workground: [
                { title: '返工数据中心', component: ReworkPage },
                { title: '税务数据中心', component: TaxPage },
            ]
        }, */

        /**超级管理员 能看到全部tabs*/
        {
            role: 'admin', name: 'admin', mac: '', account: '123456', password: '123456', org: '', workground: [
                { title: '制造数据中心', component: HomePage },
                { title: '营销数据中心', component: SmreportPage },
                { title: '税务数据中心', component: TaxPage },
                { title: '库存数据中心', component: InventoryPage },
                { title: '经营数据中心', component: ManagementPage },
                { title: '股票投资数据', component: InveststockPage },
                { title: '股权投资数据', component: InvestrightPage },
                { title: '返工数据中心', component: ReworkPage },
            ]
        },
    ];


}