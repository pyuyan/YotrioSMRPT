import { Params } from './../../app/params';

export class debugHelper {
    constructor() { }

    /**
     * 调试模式下显示打印的内容
     * @param message 要打印的内容
     * @param type 类型
     */
    public static show(message: any, type: string = 'log') {
        if (Params.DEBUGMODE) {
            switch (type) {
                case 'log':
                    console.log(message);
                    break;
                case 'error':
                case 'err':
                case 'failed':
                    console.error(message);
                    break;
                case 'group':
                    console.group(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
        }
    }

    public static log(message: any) {
        debugHelper.show(message, 'log');
    }

    public static error(message: any) {
        debugHelper.show(message, 'err');
    }

    public static group(message: any) {
        debugHelper.show(message, 'group');
    }
}