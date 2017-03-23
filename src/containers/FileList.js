import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Label} from 'react-bootstrap';

import FileIcon from 'react-icons/lib/fa/file-o';
import FileIconPDF from 'react-icons/lib/fa/file-pdf-o';
import FileIconXML from 'react-icons/lib/fa/file-code-o';

import {ObjectInspector} from 'react-inspector';

import {
    ChasingDots,
} from 'better-react-spinkit'

import axios from 'axios';
import {API_KEY} from '../sbapi';

var filesize = require('filesize');


import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
    ListGroupItemHeader,
    ListGroupItemText
} from 'react-bootcards';

var downloadjs = require("downloadjs");


class FileList extends Component {

    downloadReport(reportID) {
        console.log("click on report download: ", reportID);

        axios.defaults.baseURL = 'https://te.checkpoint.com';
        axios.defaults.headers.common['Authorization'] = API_KEY;
        axios.defaults.headers.common["Cache-Control"] = "no-cache";
        // axios.defaults.headers.post['Content-Type'] = 'application/json';
        // axios.defaults.responseType = 'arraybuffer';

        axios
            .get(`/tecloud/api/v1/file/download?id=${reportID}`, {responseType: "blob"})
            .then(function (response) {
                console.log("DOWNLOAD report", reportID, "response", response);
                downloadjs(response.data);

            })
            .catch(function (error) {
                console.log("ERROR downloading report: ", error);
                alert(error);
            });
    }

    renderReportList(file) {
        if (file.apiResponse !== undefined && file.apiResponse !== null) {
            console.log("Reports for", file.fileName);
            return file
                .apiResponse
                .te
                .images
                .map((image) => {
                    console.log(image.id, image.report);
                    return <ListGroupItem>
                        {image.report.pdf_report !== undefined
                            ? <FileIconPDF
                                    onClick={() => {
                                    this.downloadReport(image.report.pdf_report);
                                }}/>
                            : null}
                        {image.report.xml_report !== undefined
                            ? <FileIconXML
                                    onClick={() => {
                                    this.downloadReport(image.report.xml_report);
                                }}/>
                            : null}
                    </ListGroupItem>
                });
        }
        return <div/>;
    }

    renderListItem(file) {
        if (file !== undefined) 

            // TO DO - this.renderReportList(file);

            return (
                <li key={"file_" + file.id} className="list-group-item">
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <ListGroup fill>
                            <ListGroupItem>
                                <a href="#">
                                    <FileIcon/>
                                </a>
                                <ListGroupItemHeader>
                                    <a href="#">{file.fileName}</a>
                                </ListGroupItemHeader>
                                <ListGroupItemText>
                                    <strong>{(file.fileType)}</strong>
                                </ListGroupItemText>
                                <ListGroupItemText>
                                    <strong>{filesize(file.fileSize)}</strong>
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemText>
                                    <strong>
                                        {file
                                            .fileLastModifiedDate
                                            .toString()}</strong>
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemText>{file.statusText}</ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>

                                <div>MD5 {file.fileMD5}</div>
                                <div>SHA1 {file.fileSHA1}</div>
                                {file.verdict === "unknown"
                                    ? <ChasingDots/>
                                    : null}
                                {file.verdict !== "unknown"
                                    ? <div>Verdict {file.verdict}</div>
                                    : null}
                                {file.verdict === "benign"
                                    ? <Label bsStyle="success">Benign</Label>
                                    : null}
                                {file.verdict === "malicious"
                                    ? <Label bsStyle="danger">Malicious</Label>
                                    : null}
                            </ListGroupItem>
                            <ListGroupItem>{this.renderReportList(file)}</ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemText>
                                    <ObjectInspector data={file.apiResponse}/>
                                </ListGroupItemText>
                            </ListGroupItem>
                        </ListGroup>
                        <CardFooter></CardFooter>
                    </Card>

                </li>
            );
        return null;
    }

    renderList() {
        console.log("renderList", this.props.files);
        return Object
            .keys(this.props.files)
            .map((key, index) => {
                console.log("renderList filelist", key, index, this.props.files[key]);
                return this.renderListItem(this.props.files[key]);
            });
        // return null; return this.props.files.map((file) =>
        // {this.renderListItem(file)}) Object.keys(myObject).map(function(key, index) {
        // return this.props.files.map((file) => {return this.renderListItem(file)})
    }

    render() {
        console.log("filelist props", this.props);
        return (
            <ul className="list-group col-sm-10">
                {this.renderList()}
            </ul >
        );
    }
}

// function mapStateToProps(state) {   return {     books: state.books   }; }

function mapStateToProps(state) {
    return {files: state.files};
}

export default connect(mapStateToProps)(FileList);
//export default FileList;