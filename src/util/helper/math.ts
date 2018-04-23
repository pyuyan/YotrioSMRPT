
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
}