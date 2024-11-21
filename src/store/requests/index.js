import axios from 'axios';
import { URLs } from './configuration';
import { URL, isJWTAuthentication, isOAUTHAuthentication, APIVersion } from '../../app-config';

const Demo = () => {
  var token = {
    access_token:
      'bssssciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJc3N1ZXIiOiJub0ZldmVyIiwidW5pcXVlX25hbWUiOiIzYmRlMjE1OC03N2I0LTQzMzMtOGVhMC03NGI2NTJhNjU1ZTYiLCJVc2VySWQiOiIzYmRlMjE1OC03N2I0LTQzMzMtOGVhMC03NGI2NTJhNjU1ZTYiLCJEZXZpY2VJZCI6IiIsIlRpbWUiOiIyLzE3LzIwMjEgNDo1ODoyOCBBTSIsIm5iZiI6MTYxMzUzNzkwOCwiZXhwIjoxNjQ1MDczOTA4LCJpYXQiOjE2MTM1Mzc5MDh9.zYWO4Is7i5pU4cyGNr-myzTLqFQsC7hn2MnRbc1Ik0w',
    created: Date.now(),
  };
  localStorage.setItem('cube:token', JSON.stringify(token));

  const accessToken = JSON.parse(localStorage.getItem('cube:token')).access_token;
  axios.defaults.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
};

//Demo();

axios.defaults.baseURL = URL + APIVersion;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Decoder'] = 'Pascal';

const onRequestSuccess = (config) => {
  console.debug('request success', config);
  var tokenObject = localStorage.getItem('cube:token');
  if (tokenObject) {
    const accessToken = JSON.parse(localStorage.getItem('cube:token')).access_token;
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  }
  return config;
};

const onRequestFail = (error) => {
  console.debug('request error', error);
  return Promise.reject(error);
};

axios.interceptors.request.use(onRequestSuccess, onRequestFail);

const onResponseSuccess = (response) => {
  console.debug('response success', response);
  return response;
};
const onResponseFail = (error) => {
  console.debug('response error', error);
  return Promise.reject(error);
};

axios.interceptors.response.use(onResponseSuccess, onResponseFail);

const TriggerAxiosPost = (apiUrl, param) => {
  if (isJWTAuthentication) {
    return axios.post(apiUrl, param);
  } else if (isOAUTHAuthentication) {
    alert('Need to handle url for isOAUTHAuthentication');
    const defaultOptions = {
      baseURL: URL,
      timeout: 36000,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    };
    let instance = axios.create(defaultOptions);
    //var loginData = `?username=` + param.username + `&password=` + param.password + `&grant_type=` + param.grant_type;
    var formBody = [];
    for (var property in param) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(param[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return instance.post('connect/token', formBody);
  }
};

export default class API {
  static login = (param) => {
    return TriggerAxiosPost(URLs.login, param);
  };
  static createSuperAdmin = (param) => {
    return TriggerAxiosPost(URLs.createSuperAdmin, param);
  };

  static refreshToken = (param) => {
    const defaultOptions = {
      baseURL: URL,
      timeout: 36000,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    };
    let instance = axios.create(defaultOptions);
    var formBody = [];
    for (var property in param) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(param[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return instance.post('connect/token', formBody);
  };

  static recoverPassword = (param) => {
    const defaultOptions = {
      baseURL: URL,
      timeout: 36000,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    };
    let instance = axios.create(defaultOptions);
    var formBody = [];
    delete param.identifier;
    for (var property in param) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(param[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return instance.post('connect/token', formBody);
  };

  static getURL = (url, action) => {
    let masterConfig = JSON.parse(localStorage.entityMapping);
    if (masterConfig[url]) {
      return 'cube/' + url + '/' + action;
    } else {
      return url + '/' + action;
    }
  };

  static triggerPost = (url, param, config) => {
    var action = param.action;
    delete param.action;
    delete param.apiIdentifier;
    if (param.sortInfo) {
      var sortInfo = [];
      for (var item of param.sortInfo) {
        sortInfo.push({
          sortBy: item.colId,
          sortDirection: item.sort,
        });
      }
      param.sortInfo = sortInfo;
    }
    //param.accessToken = JSON.parse(localStorage.getItem('cube:token')).access_token;
    return axios.post(API.getURL(url, action), param, config);
    //return axios.post('cube/Maiden Cube/System/Core System/' + url + '/' + action, param);
  };

  static triggerMultiPartPost = (url, param, files, config) => {
    
    config = config || { headers: {} };

    var action = param.action;
    delete param.action;
    delete param.apiIdentifier;
    //return axios.post(url + '/' + action, param);

    const formData = new FormData();
    for (var property in param) {
      formData.append(property, param[property]);
    }

    if (files) {
      for (var file of files) {
        formData.append('ImageInfo', file);
      }
    }

    const newConfig = {
      headers: {
        'content-type': 'multipart/form-data',
        ...config.headers
      },
    };
    return axios.post(API.getURL(url, 'MultiPart' + action), formData, newConfig);
  };

  static autoFill = (param) => {
    const accessToken = JSON.parse(localStorage.getItem('cube:token')).access_token;
    var identifier = param.identifier;
    delete param.identifier;
    var url = 'controllers/portal/' + identifier;
    var formBody = [];
    for (var property in param) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(param[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody.push('accessToken=' + accessToken);
    formBody = formBody.join('&');

    return axios.post(url, formBody);
  };
}
