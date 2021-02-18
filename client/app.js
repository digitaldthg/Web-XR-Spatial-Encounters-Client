import React from 'react';
import ReactDOM from 'react-dom';
import MainApp from './Pages/MainApp';

global.THREE = require('three');
import "./scss/stylesheet.scss";

ReactDOM.render(<MainApp />, document.getElementById("app"));