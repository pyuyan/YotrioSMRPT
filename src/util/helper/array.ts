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

}