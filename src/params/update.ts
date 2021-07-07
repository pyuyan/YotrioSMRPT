/**
 * @desc app更新设置
 */
export class updateParams {

    /**
     * ****************************************
     * 以下配置为 app 更新相关的地址参数
     * ****************************************
     */

    /**
     * app更新检查的基准地址
     */
    // public static readonly AppUpdateBaseUrl: string = 'http://192.168.0.197:2222/';
    public static readonly AppUpdateBaseUrl: string = 'http://192.168.0.97:6800/';

    /**
     * app更新检查的地址
     */
    public static readonly AppUpdateCheckUrl: string = updateParams.AppUpdateBaseUrl + 'APK/app-version.json';

}