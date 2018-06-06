import { FileOpener } from '@ionic-native/file-opener';
import { Platform, AlertController, LoadingController, Content } from 'ionic-angular';
import { FTP } from "@ionic-native/ftp";
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { ftpParams } from "./../params/ftp";

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * ftp文件下载
 */
@Injectable()
export class FTPService {

    private readonly EXTENSION = '.pdf';

    private readonly MIME = 'application/pdf';

    /**
     * 本地是否存在文件
     */
    private fileExistsInLocal: boolean = false;

    /**
     * 下载后的文件路径
     */
    private localFilePath: string;

    /**
     * 文件名称 e.g. yrpt-group
     */
    fileName: string;

    /**
     * 时间 年+月 or 年 or 年+季度 e.g. 2018/12, 2017, 2017/04 
     */
    timeString: string;

    constructor(
        private document: DocumentViewer,
        private ftp: FTP,
        private http: HttpClient,
        private file: File,
        private transfer: FileTransfer,
        private fileOpener: FileOpener,
        private platform: Platform,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
    ) { }

    /**
     * @desc 获取设备的可保存文件的目录
     */
    private getDeviceDataPath(): string {
        let localPath: string = '/';
        if (this.platform.is('android')) {
            // localPath = this.file.externalDataDirectory;
            localPath = this.file.externalRootDirectory;
        } else if (this.platform.is('ios')) {
            localPath = this.file.documentsDirectory;
        }

        return localPath;
    }

    private getFTPFilePath(): string {
        const repType = this.getFileRealType();
        return ftpParams.ReportPath[repType] + this.timeString + '/';
    }

    private getHttpFilePath(): string {
        const repType = this.getFileRealType();
        const ftpViahttpParams = ftpParams.Http;
        return ftpViahttpParams.scheme + '://' + ftpViahttpParams.host + ':' + ftpViahttpParams.port + '/' + repType + '/' + this.timeString + '/';
    }

    private getFileRealType(): string {
        let repType: string;
        switch (this.fileName.substr(0, 1)) {
            case 'm':
                repType = ftpParams.reportType.month;
                break;
            case 's':
                repType = ftpParams.reportType.season;
                break;
            case 'y':
                repType = ftpParams.reportType.year;
                break;
            default:
                break;
        }
        return repType;
    }

    /**
     * @desc 获取文件本地存储路径
     */
    private getLocalFilePath(): string {
        // 直接放在SD根目录
        // return this.getDeviceDataPath() + ftpParams.DeviceLocalDir + this.timeString + '/';
        return this.getDeviceDataPath();
    }

    /**
     * @desc 生成文件名，这里是根据目录拼接成一个大文件
     */
    private genFileName(): string {
        return this.timeString.replace('/', '-') + '-' + this.fileName + this.EXTENSION;
    }

    /**
     * @desc 获取文件完整名称 包含路径
     */
    private getLocalFileComplete() {
        return this.getLocalFilePath() + this.genFileName();
    }

    /**
     * @desc 文件是否存在
     */
    private fileExist() {
        const objName = this.constructor.name;
        console.log(objName + '文件存在性检查，完整路径：' + this.getLocalFileComplete());
        this.file.checkFile(this.getDeviceDataPath(), this.genFileName()).then((res) => {
            console.log(objName + ';  文件存在');
            this.fileExistsInLocal = true;
        }).catch((err) => {
            console.log(objName + ';  出错了，原因：');
            console.log(err);
        });

        // if (!this.fileExistsInLocal) {
        //     console.log(objName + ';  文件不存在：');
        //     this.createFile().then(
        //         res => {
        //             console.log(objName + ';  创建文件成功!');
        //         },
        //         err => {
        //             console.log(objName + ';  创建文件失败!');
        //             console.log(err);
        //         });
        // }
    }

    private createFile() {
        console.log('准备创建文件!');
        console.log('本地路径：' + this.getDeviceDataPath());
        console.log('文件名称：' + this.genFileName());

        return this.file.createFile(this.getDeviceDataPath(), this.genFileName(), true);
    }

    private getViewOpt(): DocumentViewerOptions {
        let fileName = this.fileName.replace('-', '');
        const options: DocumentViewerOptions = {
            title: ftpParams.ReportName[fileName],
        }
        console.log('documentviewer opt:');
        console.log(options);
        return options;
    }

    /**
     * @desc 从ftp下载文件
     */
    private downloadFile() {
        return new Promise((resolve, reject) => {
            this.ftp.connect(
                ftpParams.FTP.host + ':' + ftpParams.FTP.port,
                ftpParams.FTP.username,
                ftpParams.FTP.userpwd
            ).then((res: any) => {
                console.log('ftp 连接建立成功！');
                const localFile = this.getLocalFileComplete();
                const remoteFile = this.getFTPFilePath() + this.fileName + this.EXTENSION;

                console.log('ftp 准备下载文件！本地路径：' + localFile + ' 远端路径：' + remoteFile);

                this.ftp.download(localFile, remoteFile).subscribe(res => {
                    console.log('ftp 下载文件进度：' + res * 100 + '%');
                    if (res == 1) {
                        console.log('PDF 文件下载完成！');
                        resolve(localFile);
                    }
                });
            }).catch((error: any) => {
                console.error('ftp 连接失败：' + error);
                reject(error);
            });
        });
    }

    private downloadViaHttp() {
        return new Promise((resolve, reject) => {
            const fileTransfer: FileTransferObject = this.transfer.create();
            const pdf = this.getLocalFileComplete(); //apk保存的目录
            const remoteUrl = this.getHttpFilePath() + this.fileName;

            fileTransfer.download(remoteUrl, pdf).then((entry) => {
                console.log('http download complete: ' + entry.toURL());
                resolve(entry.toURL());
            }, (error) => {
                console.log('http download error: ');
                console.log(error);
            });

            fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                console.log('http pdf文件下载中：' + num + '%');
            });
        });
    }

    /**
     * @desc 显示对应的pdf文件
     */
    public getPDF(fileName: string, time: string) {
        this.fileName = fileName;
        this.timeString = time;
        this.localFilePath = this.getLocalFilePath();

        this.fileExist();

        return new Promise((resolve, reject) => {
            this.downloadViaHttp().then((res) => { resolve(res) }).catch(err => reject(err));
            // if (!this.fileExistsInLocal) {
            //     this.downloadFile().then((res) => { resolve(res) }).catch(err => reject(err));
            // }
            // resolve(this.getLocalFileComplete());
        });
    }

}