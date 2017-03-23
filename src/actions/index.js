import axios from 'axios';
import {
  QUERY_FILE, LOAD_FILE, FILE_LOADED, UPLOAD_FILE, UPDATE_FILE_STATUS
} from './types';

import { API_KEY, fileExt } from '../sbapi';



export function updateFileStatus(sha1, statusText, verdict="unknown", apiResponse = null)
{
    return {
        type: UPDATE_FILE_STATUS,
        payload: {
            sha1: sha1,
            statusText: statusText,
            verdict: verdict,
            apiResponse: apiResponse
        }
    };    
}

export function loadFile(file) {
    return {
        type: LOAD_FILE,
        payload: file
    };
}

export function fileLoaded(file) {
    return {
        type: FILE_LOADED,
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
            md5: file.fileMD5,
            sha1: file.fileSHA1,
            file_name: file.fileName,
            file_type: fileExt(file.fileName),
            features: [
                "te", "av"
            ],
                te: {
                    reports: ["pdf", "xml", "tar", "full_report"]
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
            md5: file.fileMD5,
            sha1: file.fileSHA1,
            file_name: file.fileName,
            file_type: fileExt(file.fileName),
            features: [
                "te", "av"
            ],
            te: {
                reports: ["pdf", "xml", "tar", "full_report"]
            }
        }
    };
    var reqJSONString = JSON.stringify(reqJSON);
    var data = new FormData();
    data.append("request", reqJSONString);
    data.append("file", new Blob([file.file.contentArrayBuffer], {type: "application/octet-stream"}));

    const request = axios.post("/tecloud/api/v1/file/upload", data);

  return {
    type: UPLOAD_FILE,
    payload: request
  }
}