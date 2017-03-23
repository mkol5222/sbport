import axios from 'axios';

var sha1 = require('js-sha1');
var md5 = require('js-md5');

export const API_KEY = "TE_API_KEY_ZNmsk6rQwmCQkhP73swGcKkbmLq3gUi9UG7jTa4D";

export function fileExt(fileName) {
    return fileName.substr(fileName.lastIndexOf('.') + 1);
}

export function sbQuery(file) {
    console.log("sbQuery", file, file.contentArrayBuffer);
    axios.defaults.baseURL = 'https://te.checkpoint.com';
    axios.defaults.headers.common['Authorization'] = API_KEY;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.responseType = 'json';

    axios.post("/tecloud/api/v1/file/query", {
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
        })
        .then(function (response) {
            console.log("response.data", response.data);
            console.log("response.status", response.status);
            console.log("response.statusText", response.statusText);
            console.log("response.headers", response.headers);
            console.log("response.config", response.config);
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
            alert(error);
        });

}

export function sbUpload(file) {
    console.log("sbUpload", file, file.contentArrayBuffer);
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
    //console.log("a.file_data", a.file_data);
    data.append("file", new Blob([file.contentArrayBuffer], {type: "application/octet-stream"}));
    axios
        .post("/tecloud/api/v1/file/upload", data)
        .then(function (response) {
            console.log("response.data", response.data);
            console.log("response.status", response.status);
            console.log("response.statusText", response.statusText);
            console.log("response.headers", response.headers);
            console.log("response.config", response.config);
            console.log("sbUpload", JSON.stringify(response.data));
            if (response.data.response.te.images !== undefined) {
                response
                    .data
                    .response
                    .te
                    .images
                    .forEach((image) => {
                        console.log(image);
                        sbDownload(image.report.xml_report);
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
            alert(error);
        });

}

export function sbQuota() {
    axios.defaults.baseURL = 'https://te.checkpoint.com';
    axios.defaults.headers.common['Authorization'] = API_KEY;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.responseType = 'json';
    axios
        .post("/tecloud/api/v1/file/quota", {request: {}})
        .then(function (response) {
            console.log("response.data", response.data);
            console.log("response.status", response.status);
            console.log("response.statusText", response.statusText);
            console.log("response.headers", response.headers);
            console.log("response.config", response.config);
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
            alert(error);
        });
}

export function sbDownload(downloadID) {
    if (downloadID === undefined) return undefined;

    // https://te.checkpoint.com/tecloud/api/v1/file/download?id="
    axios.defaults.baseURL = 'https://te.checkpoint.com';
    axios.defaults.headers.common['Authorization'] = API_KEY;
    axios.defaults.headers.common["Cache-Control"] = "no-cache";
    //axios.defaults.headers.post['Content-Type'] = 'application/json';
    //axios.defaults.responseType = 'arraybuffer';

    axios
        .get(`/tecloud/api/v1/file/download?id=${downloadID}`)
        .then(function (response) {
            console.log("response.data", response.data);
            console.log("response.status", response.status);
            console.log("response.statusText", response.statusText);
            console.log("response.headers", response.headers);
            console.log("response.config", response.config);
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
            alert(error);
        });
}


export function investigateFile(file) {
    sbQuota();
    console.log("investigating file: ", file.name);
    var reader = new FileReader();
    reader.onload = (e) => {
        file.SHA1 = sha1(e.target.result);
        file.MD5 = md5(e.target.result);
        file.contentArrayBuffer = e.target.result;
        console.log(file.SHA1, file.name, e.target, e.target.result);
        sbQuery(file);
        sbUpload(file);
    }
    console.log("reading ", file.name);
    reader.readAsArrayBuffer(file);

}
