/**
 * @description arrayHelper 工具类 有需要的再里面加
 * @author slyfalcon
 */
export class arrayHelper {

    constructor() { }

	/**
	 * 一维数组去重
	 * @param {[Any]} arr
	 */
    public static _unique(arr: Array<any>) {
        let res: any[] = [];
        res = arr.filter((value: any, index: any, self: Array<any>) => {
            return self.indexOf(value) === index;
        });
        return res;
    }

	/**
	 * 获取数组对象的中指定key的value 集合
	 * @param {[Object]} arr    
	 * @param {[string]} column
	 */
    public static _column(arr: Array<any>, column: string) {
        return arr.reduce((previousValue: Array<any>, currentValue: Array<any>) => {
            previousValue.push(currentValue[column]);
            return previousValue;
        }, []);
    }

    /**
     * 一维对象数组按照 对象键分组
     * @param arr 一维对象数组
     * @param column 键
     * e.g. 
     * input:
     * arr = [{name:'alex', age:'11', school:'sdf'}, {name:'bob', age:'12', school:'sdf'}];
     * column = 'school'
     * output:
     * res = { sdf:[{name:'alex', age:'11', school:'sdf'}, {name:'bob', age:'12', school:'sdf'}] }
     */
    public static _group(arr: Array<any>, column: string) {
        let res: any = {};
        arr.forEach(row => {
            let name: string = row[column];
            if (!res[name]) {
                res[name] = [row];
            } else {
                res[name].push(row);
            }
        });
        return res;
    }

    /**
     * 一维数组求和
     * @param arr 一位数字，字符串 数组
     * @param decimal 精确度 默认保留3位
     */
    public static _sum(arr: Array<any>, decimal: number = 3): string {
        let sum: number = 0;
        if (arr.length != 0) {
            sum = arr.reduce((acc, val) => {
                return Number(acc) + Number(val);
            }, 0);
        }

        return parseFloat(sum.toString()).toFixed(decimal);
    }
}