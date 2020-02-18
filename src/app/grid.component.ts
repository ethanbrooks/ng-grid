import { Component, AfterViewInit, ViewChild } from '@angular/core';

import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { NgTerminal } from 'ng-terminal';


import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon, ISearchOptions } from 'xterm-addon-search';
import { SerializeAddon } from 'xterm-addon-serialize';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';
// import { Unicode11Addon } from 'xterm-addon-unicode11';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

// Use webpacked version (yarn package)
import { Terminal, Terminal as TerminalType, ITerminalOptions } from 'xterm';


import { Container, Volume, Network, Config, Secret, Service, Employee, CostInfo } from './grid.service';
import DataSource from 'devextreme/data/data_source';
// import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import RemoteFileProvider from 'devextreme/ui/file_manager/file_provider/remote';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css'],
})
export class GridComponent implements AfterViewInit {
    @ViewChild('term', { static: false }) ngTerm: NgTerminal;

    remoteProvider: RemoteFileProvider;
    imageItemToDisplay: any = {};
    popupVisible = false;

    url: string;
    speedValue = 1;
    suppliersData: any;
    productsDataMap: object = {};
    productIdBySupplier: object = {};
    orderHistoryDataMap: object = {};

    xtermjs: any = {}; //    this.xtermjs = this.ngTerm.underlying;
    protocol: any = {};
    socketURL: any = {};
    socket: any = {};
    pid: any = {};

    terminalContainer: any;
    actionElements: any;
    paddingElement: any;

    addons: { [T in AddonType]: IDemoAddon<T>} = {
        attach: { name: 'attach', ctor: AttachAddon, canChange: false },
        fit: { name: 'fit', ctor: FitAddon, canChange: false },
        search: { name: 'search', ctor: SearchAddon, canChange: true },
        serialize: { name: 'serialize', ctor: SerializeAddon, canChange: true },
        'web-links': { name: 'web-links', ctor: WebLinksAddon, canChange: true },
        webgl: { name: 'webgl', ctor: WebglAddon, canChange: true }
        // , unicode11: { name: 'unicode11', ctor: Unicode11Addon, canChange: true }
    };

    containers: any;
    volumes: any;
    networks: any;
    configs: any;
    secrets: any;
    tops: any;

    company = {
        'ID': 1,
        'CompanyName': 'SuprMart',
        'Address': '702 SW 8th Street',
        'City': 'Bentonville',
        'State': 'Arkansas',
        'Zipcode': 72716,
        'Phone': '(800) 555-2797',
        'Fax': '(800) 555-2171',
        'Website': 'http://www.nowebsitesupermart.com'
    };


    oilCosts: CostInfo[];
    goldCosts: CostInfo[];
    silverCosts: CostInfo[];
    years: Array<number>;

    employees: Employee[];

    constructor(service: Service, httpClient: HttpClient) {

        this.employees = service.getEmployees();

        this.remoteProvider = new RemoteFileProvider({
        endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images'
        });

        this.oilCosts = service.getOilCosts();
        this.goldCosts = service.getGoldCosts();
        this.silverCosts = service.getSilverCosts();
        this.years = [2010];

//        this.containers =  service.getContainers( httpClient );
        this.containers =  service.getContainersDataSource( httpClient );
        this.volumes =  service.getVolumes( httpClient );
        this.networks =  service.getNetworks( httpClient );
        this.configs =  service.getConfigs( httpClient );
        this.secrets =  service.getSecrets( httpClient );

        this.tops =  service.getTops( httpClient );
    }

    ngAfterViewInit() {
        console.log(this.ngTerm);
    }

    displayImagePopup(e) {
        this.imageItemToDisplay = e.fileItem;
        this.popupVisible = true;
    }

    onRowExpanded(event) {
        // TODO: time outs are lame and this is a race condition.
        setTimeout(() => {
            this.xtermjs = this.ngTerm.underlying;
            this.ngTerm.keyEventInput.subscribe(e => {

              //  this.ngTerm.afterViewInitSubject.next(true);

                console.log('keyboard event:' + e.domEvent.key + ', ' + e.key);

                const ev = e.domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

                if (ev.key === '13') {
                   this.ngTerm.write('\r\n$ ');
                } else if (ev.key === '8') {
                // Do not delete the prompt
                if (this.ngTerm.underlying.buffer.cursorX > 2) {
                    this.ngTerm.write('\b \b');
                }
                } else if (printable) {
                    this.ngTerm.write(e.key);
                }
            });
        }, 1000);
    }

/*
        this.terminalContainer = document.getElementById('terminal-container');

        this.actionElements = {
            findNext: <HTMLInputElement>document.querySelector('#find-next'),
            findPrevious: <HTMLInputElement>document.querySelector('#find-previous')
        };
        this.paddingElement = <HTMLInputElement>document.getElementById('padding');
*/


/**
 * Copyright (c) 2018 The xterm.js authors. All rights reserved.
 * @license MIT
 *
 * This file is the entry point for browserify.
 */
/*
/// <reference path="../typings/xterm.d.ts"/>
    setPadding(): void {
        this.xtermjs.element.style.padding = parseInt(this.paddingElement.value, 10).toString() + 'px';
        this.xtermjs.fit();
    }

    getSearchOptions(e: KeyboardEvent): ISearchOptions {
        return {
            regex: (document.getElementById('regex') as HTMLInputElement).checked,
            wholeWord: (document.getElementById('whole-word') as HTMLInputElement).checked,
            caseSensitive: (document.getElementById('case-sensitive') as HTMLInputElement).checked,
            incremental: e.key !== `Enter`
        };
    }

    disposeRecreateButtonHandler = () => {
        // If the terminal exists dispose of it, otherwise recreate it
        if (this.xtermjs) {
            this.xtermjs.dispose();
            this.xtermjs = null;
            window.term = null;
            this.socket = null;
            document.getElementById('dispose').innerHTML = 'Recreate Terminal';
        }
        else {
            this.createTerminal();
            document.getElementById('dispose').innerHTML = 'Dispose terminal';
        }
    };

    createTerminal(): void {
        // Clean terminal
        while (this.terminalContainer.children.length) {
            this.terminalContainer.removeChild(this.terminalContainer.children[0]);
        }

        const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
        this.xtermjs = new Terminal({
            windowsMode: isWindows
        } as ITerminalOptions);

        // Load addons
        const typedTerm = this.xtermjs as TerminalType;
        this.addons.search.instance = new SearchAddon();
        this.addons.serialize.instance = new SerializeAddon();
        this.addons.fit.instance = new FitAddon();
    //  addons.unicode11.instance = new Unicode11Addon();
        // TODO: Remove arguments when link provider API is the default
        this.addons['web-links'].instance = new WebLinksAddon(undefined, undefined);
        typedTerm.loadAddon(this.addons.fit.instance);
        typedTerm.loadAddon(this.addons.search.instance);
        typedTerm.loadAddon(this.addons.serialize.instance);
    //  typedTerm.loadAddon(addons.unicode11.instance);
        typedTerm.loadAddon(this.addons['web-links'].instance);

        window.term = this.xtermjs;  // Expose `term` to window for debugging purposes
        this.xtermjs.onResize((size: { cols: number, rows: number }) => {
            if (!this.pid) {
                return;
            }
            const cols = size.cols;
            const rows = size.rows;
            const url = '/terminals/' + this.pid + '/size?cols=' + cols + '&rows=' + rows;

            fetch(url, {method: 'POST'});
        });
        this.protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
        this.socketURL = this.protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

        this.xtermjs.open(this.terminalContainer);
        this.addons.fit.instance!.fit();
        this.xtermjs.focus();

        this.addDomListener(this.paddingElement, 'change', this.setPadding);

        this.addDomListener(this.actionElements.findNext, 'keyup', (e) => {
            this.addons.search.instance.findNext(this.actionElements.findNext.value, this.getSearchOptions(e));
        });

        this.addDomListener(this.actionElements.findPrevious, 'keyup', (e) => {
            this.addons.search.instance.findPrevious(this.actionElements.findPrevious.value, this.getSearchOptions(e));
        });

        // fit is called within a setTimeout, cols and rows need this.
        setTimeout(() => {
            this.initOptions(this.xtermjs);
            // TODO: Clean this up, opt-cols/rows doesn't exist anymore
            (<HTMLInputElement>document.getElementById(`opt-cols`)).value = this.xtermjs.cols;
            (<HTMLInputElement>document.getElementById(`opt-rows`)).value = this.xtermjs.rows;
            this.paddingElement.value = '0';

            // Set terminal size again to set the specific dimensions on the demo
            this.updateTerminalSize();

            fetch('/terminals?cols=' + this.xtermjs.cols + '&rows=' + this.xtermjs.rows, {method: 'POST'}).then((res) => {
                res.text().then((processId) => {
                this.pid = processId;
                this.socketURL += processId;
                this.socket = new WebSocket(this.socketURL);
                this.socket.onopen = this.runRealTerminal;
                this.socket.onclose = this.runFakeTerminal;
                this.socket.onerror = this.runFakeTerminal;
                });
            });
        }, 0);
    }

    runRealTerminal(): void {
        this.addons.attach.instance = new AttachAddon(this.socket);
        this.xtermjs.loadAddon(this.addons.attach.instance);
        this.xtermjs._initialized = true;
        this.initAddons(this.xtermjs);
    }

    runFakeTerminal(): void {
        if (this.xtermjs._initialized) {
            return;
        }

        this.xtermjs._initialized = true;
        this.xtermjs.initAddons(this.xtermjs);

        this.xtermjs.prompt = () => {
            this.xtermjs.write('\r\n$ ');
        };

        this.xtermjs.writeln('Welcome to xthis.xtermjs.js');
        this.xtermjs.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
        this.xtermjs.writeln('Type some keys and commands to play around.');
        this.xtermjs.writeln('');
        this.xtermjs.prompt();

        this.xtermjs.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) {
                this.xtermjs.prompt();
            } else if (ev.keyCode === 8) {
            // Do not delete the prompt
                if (this.xtermjs._core.buffer.x > 2) {
                this.xtermjs.write('\b \b');
                }
            } else if (printable) {
                this.xtermjs.write(e.key);
            }
        });
    }

    initOptions(term: TerminalType): void {
        const blacklistedOptions = [
            // Internal only options
            'cancelEvents',
            'convertEol',
            'termName',
            // Complex option
            'theme',
            'windowOptions'
        ];
        const stringOptions = {
            bellSound: null,
            bellStyle: ['none', 'sound'],
            cursorStyle: ['block', 'underline', 'bar'],
            fastScrollModifier: ['alt', 'ctrl', 'shift', undefined],
            fontFamily: null,
            fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            fontWeightBold: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            logLevel: ['debug', 'info', 'warn', 'error', 'off'],
            rendererType: ['dom', 'canvas'],
            wordSeparator: null
        };
        const options = Object.keys((<any>term)._core.options);
        const booleanOptions = [];
        const numberOptions = [];
        options.filter(o => blacklistedOptions.indexOf(o) === -1).forEach(o => {
            switch (typeof this.xtermjs.getOption(o)) {
                case 'boolean':
                    booleanOptions.push(o);
                    break;
                case 'number':
                    numberOptions.push(o);
                    break;
                default:
                if (Object.keys(stringOptions).indexOf(o) === -1) {
                    console.warn(`Unrecognized option: "${o}"`);
                }
            }
        });

        let html = '';
        html += '<div class="option-group">';
        booleanOptions.forEach(o => {
            html += `<div class="option"><label><input id="opt-${o}" type="checkbox" ${this.xtermjs.getOption(o) ? 'checked' : ''}/> ${o}</label></div>`;
        });
        html += '</div><div class="option-group">';
        numberOptions.forEach(o => {
            html += `<div class="option"><label>${o} <input id="opt-${o}" type="number" value="${this.xtermjs.getOption(o)}" step="${o === 'lineHeight' || o === 'scrollSensitivity' ? '0.1' : '1'}"/></label></div>`;
        });
        html += '</div><div class="option-group">';
        Object.keys(stringOptions).forEach(o => {
            if (stringOptions[o]) {
                html += `<div class="option"><label>${o} <select id="opt-${o}">${stringOptions[o].map(v => `<option ${this.xtermjs.getOption(o) === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>`;
            } else {
                html += `<div class="option"><label>${o} <input id="opt-${o}" type="text" value="${this.xtermjs.getOption(o)}"/></label></div>`;
            }
        });
        html += '</div>';

        const container = document.getElementById('options-container');
        container.innerHTML = html;

        // Attach listeners
        booleanOptions.forEach(o => {
            const input = <HTMLInputElement>document.getElementById(`opt-${o}`);
            this.xtermjs.addDomListener(input, 'change', () => {
                console.log('change', o, input.checked);
                this.xtermjs.setOption(o, input.checked);
            });
        });
        numberOptions.forEach(o => {
            const input = <HTMLInputElement>document.getElementById(`opt-${o}`);
            this.xtermjs.addDomListener(input, 'change', () => {
                console.log('change', o, input.value);
                if (o === 'cols' || o === 'rows') {
                    this.xtermjs.updateTerminalSize();
                } else if (o === 'lineHeight' || o === 'scrollSensitivity') {
                    this.xtermjs.setOption(o, parseFloat(input.value));
                    this.xtermjs.updateTerminalSize();
                } else {
                    this.xtermjs.setOption(o, parseInt(input.value));
                }
            });
        });
        Object.keys(stringOptions).forEach(o => {
            const input = <HTMLInputElement>document.getElementById(`opt-${o}`);
            this.xtermjs.addDomListener(input, 'change', () => {
                console.log('change', o, input.value);
                this.xtermjs.setOption(o, input.value);
            });
        });
    }

   initAddons(term: TerminalType): void {
        const fragment = document.createDocumentFragment();
        Object.keys(this.addons).forEach((name: AddonType) => {
            const addon = this.addons[name];
            const checkbox = document.createElement('input') as HTMLInputElement;
            checkbox.type = 'checkbox';
            checkbox.checked = !!addon.instance;
            if (!addon.canChange) {
            checkbox.disabled = true;
            }
            checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
        // TODO wtf
                addon.instance = new addon.ctor(this.socket);
                this.xtermjs.loadAddon(addon.instance);
                if (name === 'webgl') {
                setTimeout(() => {
                    document.body.appendChild((addon.instance as WebglAddon).textureAtlas);
                }, 0);
                }
            } else {
                if (name === 'webgl') {
                document.body.removeChild((addon.instance as WebglAddon).textureAtlas);
                }
                addon.instance!.dispose();
                addon.instance = undefined;
            }
            });
            const label = document.createElement('label');
            label.classList.add('addon');
            if (!addon.canChange) {
            label.title = 'This addon is needed for the demo to operate';
            }
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(name));
            const wrapper = document.createElement('div');
            wrapper.classList.add('addon');
            wrapper.appendChild(label);
            fragment.appendChild(wrapper);
        });
        document.getElementById('addons-container').appendChild(fragment);
    }

    addDomListener(element: HTMLElement, type: string, handler: (...args: any[]) => any): void {
        element.addEventListener(type, handler);
        this.xtermjs._core.register({ dispose: () => element.removeEventListener(type, handler) });
    }

    updateTerminalSize(): void {
        const cols = parseInt((<HTMLInputElement>document.getElementById(`opt-cols`)).value, 10);
        const rows = parseInt((<HTMLInputElement>document.getElementById(`opt-rows`)).value, 10);
        const width = (cols * this.xtermjs._core._renderService.dimensions.actualCellWidth + this.xtermjs._core.viewport.scrollBarWidth).toString() + 'px';
        const height = (rows * this.xtermjs._core._renderService.dimensions.actualCellHeight).toString() + 'px';
        this.terminalContainer.style.width = width;
        this.terminalContainer.style.height = height;
        this.addons.fit.instance.fit();
    }

    serializeButtonHandler(): void {
        const output = this.addons.serialize.instance.serialize();
        const outputString = JSON.stringify(output);

        document.getElementById('serialize-output').innerText = outputString;
        if ((document.getElementById('write-to-terminal') as HTMLInputElement).checked) {
            this.xtermjs.reset();
            this.xtermjs.write(output);
        }
    }




*/


    handleValueChange(e: any, supplierID: number) {
        this.productIdBySupplier[supplierID] = e.value;
        this.orderHistoryDataMap[supplierID] = {
            store: AspNetData.createStore({
                key: 'OrderID',
                loadParams: { ProductID: e.value },
                loadUrl: this.url + '/GetOrdersByProduct'
            })
        };
    }

    customizeItemTemplate(item: any) {
        item.template = 'formItem';
    }

    getProductsData(supplierID: number): any {
        return this.productsDataMap[supplierID] = this.productsDataMap[supplierID] || {
            store: AspNetData.createStore({
                key: 'ProductID',
                loadParams: { SupplierID: supplierID },
                loadUrl: this.url + '/GetProductsBySupplier',
                onLoaded: items => this.setDefaultProduct(items, supplierID)
            })
        };
    }

    setDefaultProduct(items, supplierID) {
        const firstItem = items[0];

        if (firstItem && this.productIdBySupplier[supplierID] === undefined) {
            this.productIdBySupplier[supplierID] = firstItem.ProductID;
        }
    }

    getOrderHistoryData(supplierID: number): any {
        return this.orderHistoryDataMap[supplierID];
    }
}



// Pulling in the module's types relies on the <reference> above, it's looks a
// little weird here as we're importing "this" module
// import { Terminal as TerminalType, ITerminalOptions } from 'xterm';

export interface IWindowWithTerminal extends Window {
    term: TerminalType;
    Terminal?: typeof TerminalType;
    AttachAddon?: typeof AttachAddon;
    FitAddon?: typeof FitAddon;
    SearchAddon?: typeof SearchAddon;
    SerializeAddon?: typeof SerializeAddon;
    WebLinksAddon?: typeof WebLinksAddon;
    WebglAddon?: typeof WebglAddon;
    //  Unicode11Addon?: typeof Unicode11Addon;
}
declare let window: IWindowWithTerminal;

type AddonType = 'attach' | 'fit' | 'search' | 'serialize' | 'web-links' | 'webgl'; // 'unicode11' | ;

interface IDemoAddon<T extends AddonType> {
name: T;
canChange: boolean;
ctor:
    T extends 'attach' ? typeof AttachAddon :
    T extends 'fit' ? typeof FitAddon :
    T extends 'search' ? typeof SearchAddon :
    T extends 'serialize' ? typeof SerializeAddon :
    T extends 'web-links' ? typeof WebLinksAddon :
//    T extends 'unicode11' ? typeof Unicode11Addon :
    typeof WebglAddon;
instance?:
    T extends 'attach' ? AttachAddon :
    T extends 'fit' ? FitAddon :
    T extends 'search' ? SearchAddon :
    T extends 'serialize' ? SerializeAddon :
    T extends 'web-links' ? WebLinksAddon :
    T extends 'webgl' ? WebglAddon :
//    T extends 'unicode11' ? typeof Unicode11Addon :
    never;
}
