import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const { ipcRenderer } = window.require('electron');

ipcRenderer.send('getInitialData');

ipcRenderer.once('initialData', (event, arg)=>{
  ReactDOM.render(<App initialData={arg} />, document.getElementById('root'))
});