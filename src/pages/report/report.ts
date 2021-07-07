import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';

import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
import { eventParams } from "../../params/event";
import { FTPService } from './../../service/ftp';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage extends Base {

  type: string = 'documentViewer';

  pdfSrc: any;

  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;

  constructor(
    private file: File,
    private document: DocumentViewer,
    private fileOpener: FileOpener,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ftpSer: FTPService,
  ) {
    super();

    // this.ftpSer.getPDF('mrpt-group', '2018/01').then((res) => {
    //   super.debug('PDF完整文件路径：' + res);
    //   this.pdfSrc = res;
    // });

    this.pdfSrc = 'http://192.168.0.197:2180/month/2018/01/mrpt-group.pdf';
    super.debug(this.pdfSrc);
  }

  ionViewDidLoad() {
    super.showCurrentTime();
    super.debug(this.constructor.name + '； 开始展现 FTP 文件');
    // 1. 效果差，无法打开
    // this.document.viewDocument(this.pdfSrc, 'application/pdf', { title: 'sdf' });
    // 2. 需要第三方app支持
    // this.fileOpener.open(this.pdfSrc, 'application/pdf')
    //   .then(() => console.log('File is opened'))
    //   .catch(e => { console.log('Error opening file', e); console.log(e); });
    // 3. ng2-pdf-viewer 在低版本安卓 渲染速度奇慢
    if (this.pdfSrc) {

    }
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
}
