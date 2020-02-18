import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {GridComponent} from './grid.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import { NgTerminalModule } from 'ng-terminal';
import {
  DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule,
  DxCircularGaugeModule, DxLinearGaugeModule, DxSliderModule,
  DxBoxModule,
  DxSparklineModule,
  DxFileManagerModule, DxPopupModule,
  DxTreeListModule
} from 'devextreme-angular';

import RemoteFileProvider from 'devextreme/ui/file_manager/file_provider/remote';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Service } from './grid.service';
@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot([
      { path: '', component: GridComponent, pathMatch: 'full'},
    ]),
    TransferHttpCacheModule,
    HttpClientModule,
    DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule,

    DxCircularGaugeModule, DxLinearGaugeModule, DxSliderModule,

    DxBoxModule,

    DxSparklineModule,

    DxFileManagerModule, DxPopupModule,

    DxTreeListModule,

    NgTerminalModule

  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}, Service],
  bootstrap: [GridComponent]
})
export class AppModule { }
