import { Injectable } from '@angular/core';

import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

export class Container {
    ID: string;
    Name: string;
}
export class Volume {
    ID: string;
    Name: string;
}
export class Network {
    ID: string;
    Name: string;
}
export class Config {
    ID: string;
    Name: string;
}
export class Secret {
    ID: string;
    Name: string;
}

/*

const containers: Container[] = [{
    'ID': 'sdafas',
    'Name': 'sdafas'
}];
const volumes: Volume[] = [{
    'ID': 'sdafas',
    'Name': 'sdafas'
}];
const networks: Network[] = [{
    'ID': 'sdafas',
    'Name': 'sdafas'
}];
const configs: Config[] = [{
    'ID': 'sdafas',
    'Name': 'sdafas'
}];
const secrets: Secret[] = [{
    'ID': 'sdafas',
    'Name': 'sdafas'
}];
*/

export class CostInfo {
    month: number;
    2010: number;
}

const oilCosts: CostInfo[] = [{
    month: 1,
    2010: 77
}, {
    month: 2,
    2010: 72
}, {
    month: 3,
    2010: 79
}, {
    month: 4,
    2010: 82
}, {
    month: 5,
    2010: 86
}, {
    month: 6,
    2010: 73
}, {
    month: 7,
    2010: 73
}, {
    month: 8,
    2010: 77
}, {
    month: 9,
    2010: 76
}, {
    month: 10,
    2010: 81
}, {
    month: 11,
    2010: 83
}, {
    month: 12,
    2010: 89
}];

const goldCosts: CostInfo[] = [{
    month: 1,
    2010: 1115,
}, {
    month: 2,
    2010: 1099
}, {
    month: 3,
    2010: 1114
}, {
    month: 4,
    2010: 1150
}, {
    month: 5,
    2010: 1205
}, {
    month: 6,
    2010: 1235
}, {
    month: 7,
    2010: 1193
}, {
    month: 8,
    2010: 1220
}, {
    month: 9,
    2010: 1272
}, {
    month: 10,
    2010: 1345
}, {
    month: 11,
    2010: 1370
}, {
    month: 12,
    2010: 1392
}];


const silverCosts: CostInfo[] = [{
    month: 1,
    2010: 17
}, {
    month: 2,
    2010: 28
}, {
    month: 3,
    2010: 34
}, {
    month: 4,
    2010: 37
}, {
    month: 5,
    2010: 47
}, {
    month: 6,
    2010: 37
}, {
    month: 7,
    2010: 34
}, {
    month: 8,
    2010: 40
}, {
    month: 9,
    2010: 41
}, {
    month: 10,
    2010: 30
}, {
    month: 11,
    2010: 34
}, {
    month: 12,
    2010: 32
}];

​
export class Employee {
    Full_Name: string;
    items?: Employee[];
}
​
const employees: Employee[] = [{
    'Full_Name': 'John Heart',
    'items': [{
        'Full_Name': 'Samantha Bright',
        'items': [{
            'Full_Name': 'Kevin Carter',
            'items': [{
                'Full_Name': 'Davey Jones'
            }, {
                'Full_Name': 'Victor Norris'
            }, {
                'Full_Name': 'Mary Stern'
            }]
        }]
    }, {
        'Full_Name': 'Arthur Miller',
        'items': [{
            'Full_Name': 'Brett Wade',
            'items': [{
                'Full_Name': 'Taylor Riley'
            }, {
                'Full_Name': 'Amelia Harper'
            }, {
                'Full_Name': 'Wally Hobbs'
            }, {
                'Full_Name': 'Morgan Kennedy',
                'items': [{
                      'Full_Name': 'Violet Bailey'
                   }]
              }]
            }]
        }]
    }];
​




@Injectable()
export class Service {


    getEmployees(): Employee[] {
        return employees;
    }

    getOilCosts(): CostInfo[] {
        return oilCosts;
    }
    getGoldCosts(): CostInfo[] {
        return goldCosts;
    }
    getSilverCosts(): CostInfo[] {
        return silverCosts;
    }



    getContainersDataSource(httpClient: HttpClient) {
        return new DataSource({
            store: this.getContainers(httpClient),
            reshapeOnPush: true
        });
    }
/*
    getVolumesDataSource(container: Container, httpClient: HttpClient) {
        return new DataSource({
            store: this.getVolumes(httpClient),
            reshapeOnPush: true,
            filter: ['ID', '=', container.ID]
        });
    }

    getNetworksDataSource(container: Container, httpClient: HttpClient) {
        return new DataSource({
            store: this.getNetworks(httpClient),
            reshapeOnPush: true,
            filter: ['ID', '=', container.ID]
        });
    }
    getConfigsDataSource(container: Container, httpClient: HttpClient) {
        return new DataSource({
            store: this.getConfigs(httpClient),
            reshapeOnPush: true,
            filter: ['ID', '=', container.ID]
        });
    }

    getSecretsDataSource(container: Container, httpClient: HttpClient) {
        return new DataSource({
            store: this.getSecrets(httpClient),
            reshapeOnPush: true,
            filter: ['ID', '=', container.ID]
        });
    }
*/
getTopsDataSource(container: Container, httpClient: HttpClient) {
    return new DataSource({
        store: this.getTops(httpClient),
        reshapeOnPush: true,
        filter: ['ID', '=', container.ID]
    });
}

    getContainers(httpClient: HttpClient): CustomStore {
        return new CustomStore({
            key: 'Id',
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [ ].forEach(function(i) {
                    if (i in loadOptions && !!loadOptions[i]) {
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                    }
                });
                return httpClient.get('http://localhost:1880/red-nodes/containers', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        console.log(data);
                        return {
                            data: data,
                            totalCount: data.length,
//                            summary: data.summary,
//                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw error; });
            }
        });
    }

    getVolumes(httpClient: HttpClient): CustomStore {
        return new CustomStore({
            key: 'Name',
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [ ].forEach(function(i) {
                    if (i in loadOptions && !!loadOptions[i]) {
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                    }
                });
                return httpClient.get('http://localhost:1880/red-nodes/volumes', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        console.log(data.Volumes);
                        return {
                            data: data.Volumes,
                            totalCount: data.Volumes.length,
//                            summary: data.summary,
//                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw error; });
            }
        });
    }

    getNetworks(httpClient: HttpClient): CustomStore {
        return new CustomStore({
            key: 'Id',
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [ ].forEach(function(i) {
                    if (i in loadOptions && !!loadOptions[i]) {
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                    }
                });
                return httpClient.get('http://localhost:1880/red-nodes/networks', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        console.log(data);
                        return {
                            data: data,
                            totalCount: data.length,
//                            summary: data.summary,
//                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw error; });
            }
        });
    }

    getConfigs(httpClient: HttpClient): CustomStore {
        return new CustomStore({
            key: 'ID',
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [ ].forEach(function(i) {
                    if (i in loadOptions && !!loadOptions[i]) {
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                    }
                });
                return httpClient.get('http://localhost:1880/red-nodes/configs', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        console.log(data);
                        return {
                            data: data,
                            totalCount: data.length,
//                            summary: data.summary,
//                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw error; });
            }
        });
    }

    getSecrets(httpClient: HttpClient): CustomStore {
        return new CustomStore({
            key: 'ID',
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [ ].forEach(function(i) {
                    if (i in loadOptions && !!loadOptions[i]) {
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                    }
                });
                return httpClient.get('http://localhost:1880/red-nodes/secrets', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        console.log(data);
                        return {
                            data: data,
                            totalCount: data.length,
//                            summary: data.summary,
//                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw error; });
            }
        });
    }

    getTops(httpClient: HttpClient): CustomStore {
        return new CustomStore({
            key: 'PID',
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [ ].forEach(function(i) {
                    if (i in loadOptions && !!loadOptions[i]) {
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                    }
                });
                return httpClient.get('http://localhost:1880/red-nodes/containers/top/a7d2a1f5105f', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        const response: Array<String> = [];
                        data.Processes.forEach(element => {
                            response.push( element.reduce(function(result, field, index) {
                                result[data.Titles[index]] = field;
                                return result;
                              }, {})
                            );
                        });
                        return {
                            data: response,
                            totalCount: response.length,
//                            summary: data.summary,
//                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw error; });
            }
        });
    }

}
