
export class mathHelper {
    constructor() {

    }

    /**
     * 表格数据格式化方法
     */
    public static GetFormatValue(coldata, i): string {
        if (i == 3 || i == 4 || i == -1) {
            return (Number.parseFloat(coldata)).toFixed(2).toString() + ' %';
        } else {
            return Math.round(Number.parseFloat(coldata)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    /**
     * 格式化版本号
     * e.g. input: '1.2.5' output: 000100020005
     * @param {string|object|number} version [要格式化的版本号]
     */
    public static versionFormat(version: any) {
        let v = version.toString().split('.');
        // let num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
        let num_replace: string[] = ["0000", "000", "00", "0", ""];
        for (let i = 0; i < v.length; i++) {
            let len = v[i].length;
            v[i] = num_replace[len] + v[i];
        }
        return v.join('');
    }

    /**
	 * 比较版本号
	 * @param {[stirng]} target_ver  [目标版本]
	 * @param {[string]} current_ver [当前版本]
	 * @returns {[bool]}
	 */
    public static versionCompare(target_ver, current_ver): boolean {
        let new_ver = mathHelper.versionFormat(target_ver), old_ver = mathHelper.versionFormat(current_ver);
        return new_ver > old_ver;
    }

    /**
     * 判断是否为数字
     * @param number string|number
     */
    // public static isNumeric(number) {
    //     return !isNaN(parseFloat(number)) && isFinite(number);
    // }

    /**
     * 两数相除
     * @param numerator 分子
     * @param denominator 分母
     * @param decimal 精度
     * @returns string
     */
    public static div(numerator: any, denominator: any, decimal: number = 4): string {
        let res: number = 0;
        if (Number(denominator) != 0) {
            res = Number(numerator) / Number(denominator);
        }
        return parseFloat(res.toString()).toFixed(decimal);
    }

    /**
     * 两数相乘
     * @param num1 
     * @param num2 
     * @param decimal 精度
     * @returns string
     */
    public static mul(num1: any, num2: any, decimal: number = 2): string {
        return parseFloat((Number(num1) * Number(num2)).toString()).toFixed(decimal);
    }

    /**
     * 两数相加
     * @param num1 
     * @param num2 
     * @param decimal 精度
     * @returns string
     */
    public static sum(num1: any, num2: any, decimal: number = 2): string {
        return parseFloat((Number(num1) + Number(num2)).toString()).toFixed(decimal);
    }
}