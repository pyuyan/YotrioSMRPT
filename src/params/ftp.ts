/**
 * @desc ftp相关配置配置
 */
export class ftpParams {
    private static readonly FILEPATHPREFIX = '/report/pdf/';

    public static readonly Http: any = {
        scheme: 'http',
        host: '192.168.0.197',
        port: '2180',
    }

    public static readonly reportType: any = {
        month: 'month',
        year: 'year',
        season: 'season',
    };

    /*
    1.集团年度经营分析报告      yrpt-group (年度)
    2.永强投资年度经营分析报告  yrpt-invest (年度)

    3.集团财务简报       mrpt-group (月度)
    4.北京联拓财务简报  mrpt-beijing (月度)
    5.境外公司财务简报  mrpt-abroad (月度)

    6.永强投资财务简报  srpt-invest  (季度)
    */

    public static readonly ReportName: any = {
        yrptgroup: '集团年度经营分析报告',
        yrptinvest: '永强投资年度经营分析报告',

        mrptgroup: '集团财务简报',
        mrptbeijing: '北京联拓财务简报 ',
        mrptabroad: '境外公司财务简报 ',

        srptinvest: '永强投资财务简报 ',
    };

    public static readonly FTP: any = {
        host: '192.168.0.197',
        port: '2100',
        username: 'ftpfi',
        userpwd: 'asdasd',
    }

    /**
     * @desc 下载到本地后的基准路径
     */
    public static readonly DeviceLocalDir: string = 'YotrioSMRPT' + ftpParams.FILEPATHPREFIX;

    /**
     * 月报，季报，年报 ftp 基准路径
     */
    public static readonly ReportPath: any = {
        month: ftpParams.FILEPATHPREFIX + ftpParams.reportType.month + '/',
        season: ftpParams.FILEPATHPREFIX + ftpParams.reportType.season + '/',
        year: ftpParams.FILEPATHPREFIX + ftpParams.reportType.year + '/',
    };



}