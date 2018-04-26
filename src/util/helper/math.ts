
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
        let v = version.toString();
        v = v.split('.');
        let num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
        for (let i = 0; i < v.length; i++) {
            let len = v[i].length;
            v[i] = r[len] + v[i];
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
        if (new_ver == old_ver) {
            return false;
        } else if (new_ver > old_ver) {
            return true;
        } else {
            return false;
        }
    }
}