
//import _ from 'lodash';
import { ADD_FILE, QUERY_FILE, LOAD_FILE, UPLOAD_FILE } from '../actions/types';

import {queryFile, uploadFile} from '../actions';

var sha1 = require('js-sha1');
var md5 = require('js-md5');

//console.log("ADD_FILE", ADD_FILE);

function loadFile(file, afterFinished) {
    
    const reader = new FileReader();
    reader.onload = (e) => {
        file.SHA1 = sha1(e.target.result);
        file.MD5 = md5(e.target.result);
        file.contentArrayBuffer = e.target.result;
        console.log("Loaded file", file.SHA1, file.name, e.target, e.target.result);
        afterFinished();
    }
    console.log("reading ", file.name);
    reader.readAsArrayBuffer(file);
}

function fileBySHA1(state, hash)
{
    console.log("fileBySHA1", state, hash);
    return state.find((v,i,o)=>{
        console.log("find", v,i,o);
        return v.SHA1 === hash;
    });
}

function reviewQueryOrUploadStatus(state, action) {
            if (action.payload.status !== undefined && action.payload.status === 200) {
            if (action.payload.data !== undefined && action.payload.data.response !== undefined) {
                const resp = action.payload.data.response;
                console.log(resp.te.status.code, resp.te.status.label, resp.te.status.message);

                if (resp.te.status.code === 1004) {
                    // not found, UPLOAD
                    const file = fileBySHA1(state, resp.sha1);
                    console.log("file by hash", file);
                    if (file !== undefined) action.asyncDispatch(uploadFile(file));
                }
            }
        }
        return state;
}

export default function(state = [], action) {
//   switch (action.type) {
//     case FETCH_BOOKS:
//       const booksById = _.mapKeys(action.payload.data, 'id');
//       return _.extend({}, state, booksById);
//     case FETCH_BOOK:
//       const book = action.payload.data;
//       return _.extend({}, state, { [book.id]: book });
//   }
  switch (action.type) {
    case ADD_FILE:
        console.log(action.type, "with result", [...state, action.payload]);
        return [...state, action.payload];
    case QUERY_FILE:
        console.log(action.type, "with payload", action.payload);
        return reviewQueryOrUploadStatus(state, action);
    case UPLOAD_FILE:
        console.log(action.type, "with payload", action.payload);
        return reviewQueryOrUploadStatus(state, action);
    case LOAD_FILE:
        const file = action.payload;
        console.log(action.type, "with payload", action.payload);
        loadFile(file, ()=>{action.asyncDispatch(queryFile(file))});
        return state;
  }
  return state;
}