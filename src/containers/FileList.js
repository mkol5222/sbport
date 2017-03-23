
import React, { Component } from 'react';
import { connect } from 'react-redux';

class FileList extends Component {
  componentWillMount() {
    //this.props.fetchBooks();
  }

  renderListItem(file) {
    return (
      <li key={file.name} className="list-group-item">
        {file.name}
      </li>
    );
  }

  renderList() {
    //return this.props.files.map((file) => {this.renderListItem(file)})
    return this.props.files.map((file) => {return this.renderListItem(file)})
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