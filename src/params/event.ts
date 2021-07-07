/**
 * @desc event所有事件配置
 */
export class eventParams {
    /**
     * ****************************************
     * 以下配置为 各个 event 的 topic
     * ****************************************
     */

    //所有公共的topic
    public static readonly common: any = {
        before: {},
        after: {
            monthChanged: 'common:after:monthChanged',
            periodChanged: 'common:after:periodChanged',
            login: 'common:after:login',
        },
    };

    //所有tax 税务中心的 topic
    public static readonly tax: any = {
        before: {},
        after: {
            yearChanged: 'tax:after:yearChanged',
        },
    };

    //所有inventory 库存中心的topic
    public static readonly inventory: any = {
        before: {},
        after: {
            monthChanged: 'inventory:after:monthChanged',
        },
    };

    //所有investStock 股票投资中心的topic
    public static readonly investStock: any = {
        before: {},
        after: {
            periodChanged: 'investStock:after:periodChanged',
        },
    };

    //所有investRight 股权投资中心的topic
    public static readonly investRight: any = {
        before: {},
        after: {
            periodChanged: 'investRight:after:periodChanged',
        },
    };

    //所有management 经营业绩的topic
    public static readonly management: any = {
        before: {},
        after: {
            periodChanged: 'management:after:periodChanged',
        },
    };

    //所有rework 制造部返工数据 topic
    public static readonly rework: any = {
        before: {},
        after: {
            periodChanged: 'rework:after:periodChanged',
        },
    };
}