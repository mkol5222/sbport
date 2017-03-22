import axios from 'axios';

var sha1 = require('js-sha1');
var md5 = require('js-md5');

const API_KEY = "TE_API_KEY_ZNmsk6rQwmCQkhP73swGcKkbmLq3gUi9UG7jTa4D";

export function fileExt(fileName) {
    return fileName.substr(fileName.lastIndexOf('.') + 1);
}

export function sbQuery(hash) {
    axios.defaults.baseURL = 'https://te.checkpoint.com';
    axios.defaults.headers.common['Authorization'] = API_KEY;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios
        .post("/tecloud/api/v1/file/query", {
            request: {
                md5: hash.md5,
                sha1: hash.sha1,
                features: ["te", "av"]
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

export function investigateFile(file) {
    console.log("investigating file: ", file.name);
    var reader = new FileReader();
    reader.onload = (e) => {
        file.SHA1 = sha1(e.target.result);
        file.MD5 = md5(e.target.result);
        console.log(file.SHA1, file.name);
        sbQuery({sha1: file.SHA1, md5: file.MD5});
    }
    console.log("reading ", file.name);
    reader.readAsArrayBuffer(file);

}
