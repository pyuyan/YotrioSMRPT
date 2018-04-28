import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * 对http的简单二次封装
 */
@Injectable()
export class HttpService {

    url: string = '';

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(public http: HttpClient) { }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    getUrl() {
        return this.url;
    }

    get(endpoint: string, params?: any, reqOpts?: any) {
        if (!reqOpts) {
            reqOpts = {
                params: new HttpParams(),
                header: this.headers
            };
        }

        if (params) {
            reqOpts.params = new HttpParams();
            for (let k in params) {
                reqOpts.params = reqOpts.params.set(k, params[k]);
            }
        }

        return this.http.get(this.url + '/' + endpoint, reqOpts);
    }

    post(endpoint: string, body: any, reqOpts?: any) {
        if (!reqOpts) {
            reqOpts = {
                headers: this.headers
            };
        }
        return this.http.post(this.url + '/' + endpoint, body, reqOpts);
    }
}