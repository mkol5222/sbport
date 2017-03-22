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
            <NavItem eventKey={1} href="#">Link</NavItem>
            <NavItem eventKey={2} href="#">Link</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link Right</NavItem>
            <NavItem eventKey={2} href="#">Link Right</NavItem>
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
                  <h2>Uploading {this.state.files.length}
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

      </div>
    );
  }
}

export default App;
