import axios from 'axios';
import {
  QUERY_FILE, LOAD_FILE, UPLOAD_FILE
} from './types';

import { API_KEY, fileExt } from '../sbapi';

export function loadFile(file) {
    return {
        type: LOAD_FILE,
        payload: file
    };
}

export function queryFile(file) {
    axios.defaults.baseURL = 'https://te.checkpoint.com';
    axios.defaults.headers.common['Authorization'] = API_KEY;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.responseType = 'json';

    const request = axios.post("/tecloud/api/v1/file/query", {
        request: {
            md5: file.MD5,
            sha1: file.SHA1,
            file_name: file.name,
            file_type: fileExt(file.name),
            features: [
                "te", "av"
            ],
                te: {
                    reports: ["xml", "pdf"]
                }
            }
        });

  return {
    type: QUERY_FILE,
    payload: request
  }
}

export function uploadFile(file) {
    axios.defaults.baseURL = 'https://te.checkpoint.com';
    axios.defaults.headers.common['Authorization'] = API_KEY;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.responseType = 'json';
    
    var reqJSON = {
        request: {
            md5: file.MD5,
            sha1: file.SHA1,
            file_name: file.name,
            file_type: fileExt(file.name),
            features: [
                "te", "av"
            ],
            te: {
                reports: ["xml", "pdf"]
            }
        }
    };
    var reqJSONString = JSON.stringify(reqJSON);
    var data = new FormData;
    data.append("request", reqJSONString);
    data.append("file", new Blob([file.contentArrayBuffer], {type: "application/octet-stream"}));

    const request = axios.post("/tecloud/api/v1/file/upload", data);

  return {
    type: UPLOAD_FILE,
    payload: request
  }
}