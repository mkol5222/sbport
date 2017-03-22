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

import { investigateFile } from "./sbapi";

import ReactJsonSyntaxHighlighter from 'react-json-syntax-highlighter'

class App extends Component {

  state = {
    files: []
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
    this.setState({files: acceptedFiles});
    acceptedFiles.forEach((file) => {investigateFile(file);});
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
            {this.state.files.length > 0
              ? <div>
                  <h2>Investigating {this.state.files.length}
                    files...</h2>
                  <div>{this
                      .state
                      .files
                      .map((file) => <img key={file.name} src={file.preview} alt={file.name}></img>)}</div>
                </div>
              : null}
          </Col>

          <Col md={1}/>

        </Row>
        <div>
          <ReactJsonSyntaxHighlighter obj={this.state} />
        </div>

      </div>
    );
  }
}

export default App;
