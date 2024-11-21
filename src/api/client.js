import axios from 'axios'
import { baseURL } from '../store/constant'
import API from '../store/requests';

const apiClient = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json',
        'x-request-from': 'internal'
    }
})

apiClient.interceptors.request.use(function (config) {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    if (username && password) {
        config.auth = {
            username,
            password
        }
    }

    return config
})

const apiConfig = {
    headers: {
        'Decoder': 'Camel'
    }
}

const TableMapping = {
};

const loadTableMapping = () =>{
    let entityMapping = JSON.parse(localStorage.entityMapping);
    for(var tableId in entityMapping){
        TableMapping[entityMapping[tableId]['entity']] = tableId;
    }
}

const getTableId = name => {
    if(!TableMapping[name]){
        loadTableMapping();
    }
    return TableMapping[name];
}

export const list = (tableName, params) => {
    return API.triggerPost(getTableId(tableName), { action: 'list', includeId: true, ...params }, apiConfig);
}

export const load = (tableName, id) => {
    return API.triggerPost(getTableId(tableName), { action: 'load', guid: id, includeId: true }, apiConfig);
}

export const insert = (tableName, params) => {
    return API.triggerMultiPartPost(getTableId(tableName), { action: 'insertload', ...params }, null, apiConfig);
}

export const update = (tableName, params) => {
    return API.triggerMultiPartPost(getTableId(tableName), { action: 'updateload', ...params }, null, apiConfig);
}

export const rowDelete = (tableName, params) => {
    return API.triggerPost(getTableId(tableName), { action: 'delete', ...params })
}

export default apiClient
