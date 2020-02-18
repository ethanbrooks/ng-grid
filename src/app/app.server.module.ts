
import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import { DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';
import { NgTerminalModule } from 'ng-terminal';
import {AppModule} from './app.module';
import {GridComponent} from './grid.component';

@NgModule({
  imports: [
    // The AppServerModule should import your AppModule followed
    // by the ServerModule from @angular/platform-server.
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule,
    NgTerminalModule
  ],
  // Since the bootstrapped component is not inherited from your
  // imported AppModule, it needs to be repeated here.
  bootstrap: [GridComponent],
})
export class AppServerModule {}
