export class dateHelper {

    constructor() { }

    /**
     * 获取指定年月的 月初到月末时间，默认返回当月的月初月末数据
     * @param year 指定年份 e.g. 2017,2018
     * @param month 指定月份 e.g. 1
     */
    public static getMonthDayRange(year: any = null, month: any = null) {
        let dateObj = new Date();
        let lastDay;
        let y = Number(year), m = Number(month) - 1;
        if (year < 1970 || m > 12 || m < 0 || Math.floor(m) != m) {
            y = dateObj.getFullYear();
            m = dateObj.getMonth();
        }
        lastDay = new Date(y, m + 1, 0);
        // console.log(lastDay)
        // console.log(lastDay.toString().split(' ')[2])
        return { year: y, month: m + 1, firstDay: 1, lastDay: (new Date(lastDay).getDate()) };
    }
}