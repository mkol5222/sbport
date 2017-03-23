import React, {Component} from 'react';
import './App.css';
import {
  Navbar,
  Nav,
  NavDropdown,
  MenuItem,
  NavItem,
  Row,
  Col
} from 'react-bootstrap';
const Dropzone = require('react-dropzone');

//import { investigateFile } from "./sbapi";
import {queryFile, loadFile} from './actions';

import ReactJsonSyntaxHighlighter from 'react-json-syntax-highlighter'

import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxPromise from 'redux-promise';

import { ADD_FILE } from './actions/types';

import FileList from './containers/FileList';

import {asyncDispatchMiddleware} from './middleware/asyncdispatch';

console.log("FileList", FileList);

class App extends Component {

 constructor(props) {
    super(props);
    this.lastFileID = 0;
    this.store=createStore(reducers, applyMiddleware(ReduxPromise, asyncDispatchMiddleware));
    // applyMiddleware(ReduxPromise)(
    console.log(this.store.getState());
  }

  getNewFileID = () => {
    this.lastFileID++;
    return this.lastFileID;
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
    //this.setState({files: [...this.state.files, ...acceptedFiles]});
    acceptedFiles.forEach((file) => {
      //investigateFile(file);
      // add to list
      const newFileID = this.getNewFileID();
      this.store.dispatch({type: ADD_FILE, payload: { id: newFileID, file: file} });
      // query cloud
      //this.store.dispatch(queryFile(file));
      // load and calculate hashes
      //this.store.dispatch(loadFile({ id: newFileID, file: file}));
    });
  }

  render() {

    const navbarInstance = (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">SandBlast Portal</a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="http://blog.checkpoint.com/tag/sandblast-agent-forensics/">SBA Forensics</NavItem>
            <NavItem eventKey={2} href="https://threatmap.checkpoint.com/ThreatPortal/livemap.html">Threat Map</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="https://www.threat-cloud.com/ThreatPortal/#/">Threat Portal</NavItem>
            <NavItem eventKey={2} href="https://threatwiki.checkpoint.com/threatwiki/public.htm">Threat Wiki</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );

    return (
      <div>
        {navbarInstance}

        <Row>
          <Col md={1}/>
          <Col md={2}>
            <Dropzone onDrop={this.onDrop}>
              Drop files or click to upload
            </Dropzone>
          </Col>
         
          <Col md={8}>
            <FileList store={this.store}/>
          </Col>

          <Col md={1}/>

        </Row>

                

      </div>
    );
  }
}

export default App;
