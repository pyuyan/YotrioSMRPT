import { Params } from './../../app/params';

export class debugHelper {
    constructor() { }

    /**
     * 调试模式下显示打印的内容
     * @param message 要打印的内容
     * @param type 类型
     */
    public static show(message: any, type: string = 'log') {
        switch (type) {
            case 'log':
                Params.DEBUGMODE && console.log(message);
                break;
            case 'error':
            case 'err':
            case 'failed':
                Params.DEBUGMODE && console.error(message);
                break;
            case 'group':
                Params.DEBUGMODE && console.group(message);
                break;
            default:
                Params.DEBUGMODE && console.log(message);
                break;
        }
    }
}