import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {sbQuota, sbDownload} from "./sbapi.js";

sbQuota();
sbDownload("f754cb42-2679-4aaf-adf9-c61cf090488b");

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
