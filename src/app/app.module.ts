import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {GridComponent} from './grid.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import { DxTreeListModule } from 'devextreme-angular';

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
    DxTreeListModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  bootstrap: [GridComponent]
})
export class AppModule { }
