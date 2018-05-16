
/**
 * 以下是一些配置常量 2018年4月23日08:36:21 slyfalcon
 */
export class Params {

    /**
     * 是否是调试模式
     */
    public static readonly DEBUGMODE: boolean = false;
    /**
     * 默认密码
     */
    public static readonly DefaultPWD: string = '002489';
    /**
     * ESB入口
     */
    public static readonly ESBPortal: string = 'http://192.168.0.197:8280';


    /**
     * ****************************************
     * 以下配置为 app 更新相关的地址参数
     * ****************************************
     */

    /**
     * app更新检查的基准地址
     */
    public static readonly AppUpdateBaseUrl: string = 'http://192.168.0.197:2222/';
    /**
     * app更新检查的地址
     */
    public static readonly AppUpdateCheckUrl: string = Params.AppUpdateBaseUrl + 'app-version.json';

    /**
     * ****************************************
     * 以下配置为 各个 event 的 topic
     * ****************************************
     */

    /**
     * 公用topic 改变月份的 topic
     */
    public static readonly commonAterMonthChanged: string = 'common:after:monthChanged';

    /**
     * tax 税务中心 改变年份的 topic
     */
    public static readonly taxAterYearChanged: string = 'tax:after:yearChanged';
    
}
