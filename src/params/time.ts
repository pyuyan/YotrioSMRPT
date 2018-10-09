/**
 * @desc 上传日期参数设置
 */
export class timeParams {

    /**
     * ****************************************
     * 以下配置为 上传日期相关参数
     * ****************************************
     */

    //库存上传时间
    public static readonly inventory: any = {
        uploadDate: 16,
    };
    //股票上传时间
    public static readonly investstock: any = {
        uploadDate: 12,
    };
    //股票上传时间
    public static readonly investright: any = {
        uploadDate: 12,
    };
    //报告上传时间
    public static readonly report: any = {
        uploadDate: 22,
    };
    //经营数据上传时间
    public static readonly management: any = {
        uploadDate: 25,
    };
    //税务数据上传时间
    public static readonly tax: any = {
        uploadDate: 18,
    };
}