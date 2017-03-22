import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { queryHash } from "./sbapi";

//require('nw.gui').Window.get().showDevTools();

queryHash({md5: "963679d6fc952c9ccf70315811bc1993"});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
