
import React, { Component } from 'react';
import { connect } from 'react-redux';

class FileList extends Component {
  componentWillMount() {
    //this.props.fetchBooks();
  }

  renderListItem(file) {
    if (file !== undefined) return (
      <li key={"file_"+file.id} className="list-group-item">
        <div>{file.fileName}</div>
        <div>{file.fileSize}</div>
        <div>{file.fileLastModifiedDate.toString()}</div>
        <div>{file.fileType}</div>
        <div>MD5 {file.fileMD5}</div>
        <div>SHA1 {file.fileSHA1}</div>
        <div>Verdict {file.verdict}</div>

      </li>
    );
    return null;
  }

  renderList() {
      console.log("renderList", this.props.files);
      return Object.keys(this.props.files).map((key, index) => {
        console.log("renderList filelist", key, index, this.props.files[key]);
        return this.renderListItem(this.props.files[key]);
      });
      //return null;
    //return this.props.files.map((file) => {this.renderListItem(file)})
    //Object.keys(myObject).map(function(key, index) {
    //return this.props.files.map((file) => {return this.renderListItem(file)})
  }

  render() {
      console.log("filelist props", this.props);
    return (
      <ul className="list-group col-sm-4">
        {this.renderList()}
      </ul>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     books: state.books
//   };
// }

function mapStateToProps(state) {
    return {
        files: state.files
    };
}

export default connect(mapStateToProps)(FileList);
//export default FileList;