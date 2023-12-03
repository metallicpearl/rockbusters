import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Label  from './App';
import reportWebVitals from './reportWebVitals';
import StartScreen from './StartScreen';

window.addEventListener("DOMContentLoaded", function (e) {
const root = ReactDOM.createRoot(document.querySelector('#root'));
//const labelRoot = ReactDOM.createRoot(document.getElementsByClassName('.questionLabel'));

root.render(<App />)


});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
