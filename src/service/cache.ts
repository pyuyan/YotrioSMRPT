import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * @desc 一个简单的kvcache，介质为：local 2018年4月27日10:10:14
 * @author slyfalcon
 */
@Injectable()
export class CacheService {
    /**
     * 缓存键
     */
    private CACHE_KEY: string = '_YOTRIOSMRPT_';

    constructor(public storage: Storage) { }

    setData(key: string = '', value: any) {
        if (!value || Object.keys(value).length == 0 || value.length == 0) return;
        let _key: string = this.getRealKey(key);
        return this.storage.set(_key, value);
    }

    getData(key: string = '') {
        return this.storage.get(this.getRealKey(key));
    }

    /**
     * 清空缓存
     */
    clear() {
        this.storage.clear();
    }

    private getRealKey(key: string = '') {
        return this.CACHE_KEY + key;
    }
}