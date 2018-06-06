/**
 * @desc 所有url配置
 */
export class urlParams {

    /**
     * ESB入口
     */
    public static readonly ESBPortal: string = 'http://192.168.0.197:8280';

    //common
    public static readonly common: any = {
        endpoint: {
            timeMark: '/getTimeMark/do',
            keyDepartment: '/getKeyDept/do',
            SaleTransferData: '/getSaleTransferData/do',
            yearTax: 'getYearTAX/do',
            yearInventory: 'getYearInventory/do',
            stockInvest: 'getStockInvest/do',
            rightInvest: 'getStockRightInvest/do',
            businessProfit: 'getBusinessProfit/do'
        },
        url: {},
    };
    //home页面
    public static readonly home: any = {
        endpoint: {},
        url: {},
    };
    //smreport页面
    public static readonly smreport: any = {
        endpoint: {},
        url: {},
    };
    //inventory页面
    public static readonly inventory: any = {
        endpoint: {},
        url: {},
    };
    //tax页面
    public static readonly tax: any = {
        endpoint: {},
        url: {},
    };
    //InvestStock页面
    public static readonly InvestStock: any = {
        endpoint: {},
        url: {},
    };
    //InvestRight页面
    public static readonly InvestRight: any = {
        endpoint: {},
        url: {},
    };
}