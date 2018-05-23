/**
 * @description arrayHelper 工具类 有需要的再里面加
 * @author slyfalcon
 */
export class arrayHelper {

    constructor() { }

	/**
	 * @desc 一维数组去重
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
	 * @desc 获取数组对象的中指定key的value 集合
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
     * @desc 一维对象数组按照 对象键分组
     * @param {[Object]} arr 一维对象数组
     * @param {[string]} column 键
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
     * @desc 一维数组求和
     * @param arr 一位数组，字符串 数组
     * @param {[number]} decimal 精确度 默认保留3位
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

    /**
     * @desc 一维数组按照指定键排序 note:这里指定键的键值必须为 string || number
     * @param {[Object]} arr 一位对象数组
     * @param {[string]} column 对应的键
     * @param {[string]} type  递增：asc 递减：desc
     * e.g. 
     * input: sdf = [{test:'123'},{test:'120'},{test:'111'}]
     * _sortNum(sdf, 'test', 'asc')
     * output: sdf = [{test:'111'},{test:'120'},{test:'123'}]
     */
    public static _sortNum(arr: Array<any>, column: string, type: string = 'desc') {
        arr.sort((a, b) => {
            if (type === 'desc') {
                return Number.parseFloat(a[column]) > Number.parseFloat(b[column]) ? -1 : 1;
            } else {
                return Number.parseFloat(a[column]) > Number.parseFloat(b[column]) ? 1 : -1;
            }
        });
        return arr;
    }
}