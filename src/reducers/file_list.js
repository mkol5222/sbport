//import _ from 'lodash';
import {
    ADD_FILE,
    QUERY_FILE,
    LOAD_FILE,
    FILE_LOADED,
    UPLOAD_FILE,
    UPDATE_FILE_STATUS
} from '../actions/types';

import {queryFile, uploadFile, fileLoaded, loadFile, updateFileStatus} from '../actions';

var sha1 = require('js-sha1');
var md5 = require('js-md5');

var dotProp = require('dot-prop-immutable');

function fileBySHA1(state, hash) {
    //console.log("fileBySHA1", state, hash);
    return state.find((v, i, o) => {
        //console.log("find", v, i, o);
        return v.fileSHA1 === hash;
    });
}

function reviewQueryOrUploadStatus(state, action) {
    if (action.payload.status !== undefined && action.payload.status === 200) {
        if (action.payload.data !== undefined && action.payload.data.response !== undefined) {
            const resp = action.payload.data.response;
            console.log(resp.te.status.code, resp.te.status.label, resp.te.status.message);

            const file = fileBySHA1(state, resp.sha1);
            //console.log("file by hash", file);

            switch (resp.te.status.code) {
                case 1004:
                    // not found, UPLOAD
                    if (file !== undefined) 
                        action.asyncDispatch(uploadFile(file));
                    break;

                case 1003:
                case 1002:
                    // 1003 = PENDING , 1002 = UPLOAD_SUCCESS
                    if (file !== undefined) {
                        var activity="checked";
                        if (resp.te.status.code == 1002) activity="uploaded";
                        
                        action.asyncDispatch(updateFileStatus(resp.sha1, `file ${activity} ${new Date().toString()}`));
                        setTimeout(() => action.asyncDispatch(queryFile(file)), 30000);
                    }
                    break;
                case 1001: //FOUND
                case 1006: //PARTIALLY_FOUND
                    action.asyncDispatch(updateFileStatus(resp.sha1, `file found ${new Date().toString()}`, resp.te.combined_verdict));
                    console.log("found");
                    break;
            }

        }
    }
    return state;
}

export default function (state = [], action) {
    //   switch (action.type) {     case FETCH_BOOKS:       const booksById =
    // _.mapKeys(action.payload.data, 'id');       return _.extend({}, state,
    // booksById);     case FETCH_BOOK:       const book = action.payload.data;
    // return _.extend({}, state, { [book.id]: book });   }
    switch (action.type) {
        case ADD_FILE:
            console.log(action.type, "with result", [
                ...state,
                action.payload
            ]);

            const newFile = {
                id: action.payload.id,
                file: action.payload.file,
                fileName: action.payload.file.name,
                fileSize: action.payload.file.size,
                fileType: action.payload.file.type,
                fileLastModifiedDate: action.payload.file.lastModifiedDate,
                verdict: "unknown",
                avVerdict: "unknown",
                statusText: `file added ${new Date().toString()}`
            }
            var newState = [
                ...state,
                newFile
            ];
            console.log("newState", newState);
            action.asyncDispatch(loadFile(newFile));
            return newState;

        case LOAD_FILE:
            console.log(action.type, "with payload", action.payload);

            function loadFileUsingFileReader(file, afterFinished) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    file.SHA1 = sha1(e.target.result);
                    file.MD5 = md5(e.target.result);
                    file.contentArrayBuffer = e.target.result;
                    console.log("Loaded file", file.SHA1, file.name, e.target, e.target.result);
                    afterFinished();
                }
                console.log("reading ", file.name, "within state", state);
                reader.readAsArrayBuffer(file);
            }

            loadFileUsingFileReader(action.payload.file, () => {
                action.asyncDispatch(fileLoaded(action.payload));
            });
            return state;

        case FILE_LOADED:
            console.log("FILE_LOADED before state update", state, action)

            var fileUpdatedAfterLoaded = Object.assign({}, action.payload, {
                fileMD5: action.payload.file.MD5,
                fileSHA1: action.payload.file.SHA1
            });
            console.log("fileUpdatedAfterLoaded", fileUpdatedAfterLoaded);

            var newStateAfterLoaded = state.map((listedFile) => {
                console.log("state update", listedFile, action.payload.id);
                if (listedFile.id === action.payload.id) {
                    return fileUpdatedAfterLoaded;
                }
                return listedFile;
            });
            action.asyncDispatch(queryFile(fileUpdatedAfterLoaded));
            console.log("FILE_LOADED after  state update", newStateAfterLoaded);
            return newStateAfterLoaded;
            break;

        case UPDATE_FILE_STATUS:
            console.log("UPDATE_FILE_STATUS", state, action)

            const fileForStatusUpdate = fileBySHA1(state, action.payload.sha1);
            if (fileForStatusUpdate !== undefined) {
                var fileUpdatedWithStatus = Object.assign({}, fileForStatusUpdate, {
                    statusText: action.payload.statusText,
                    verdict: action.payload.verdict
                });
                console.log("fileUpdatedWithStatus", fileUpdatedWithStatus);

                var newStateAfterStatusUpdate = state.map((listedFile) => {
                    console.log("state update", listedFile, fileForStatusUpdate.id);
                    if (listedFile.id === fileForStatusUpdate.id) {
                        return fileUpdatedWithStatus;
                    }
                    return listedFile;
                });
                console.log("UPDATE_FILE_STATUS after  state update", newStateAfterStatusUpdate);

                return newStateAfterStatusUpdate;
            }
            return state;
            break;

        case QUERY_FILE:
            console.log(action.type, "with payload", action.payload);
            return reviewQueryOrUploadStatus(state, action);
        case UPLOAD_FILE:
            console.log(action.type, "with payload", action.payload);
            return reviewQueryOrUploadStatus(state, action);

    }
    return state;
}