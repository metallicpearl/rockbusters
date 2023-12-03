// import logo from './logo.svg';
import React, { useEffect, useState, useRef, styles } from 'react';
import { ReactComponentElement, Component } from 'react';
import './App.css';

let isLoaded = false;
let pageLoaded;


function StartScreen() {
  const [screenHidden,newScreenHidden] = useState(false);
  const cardStyle = {
    backgroundColor: 'grey'
  }


  pageLoaded = (
    <div className="App" position="fixed" hidden={screenHidden}>
      <header className="App-header" >
        <span>
       <p>
        <label>
          WELCOME TO ROCKBUSTERS!
        </label>
        </p>
        <p>
        <label>
          How to play:
        </label>
        </p>
        <p>
        <label>
          The 'cryptic' clue given should refer to a band or artist. The initials of the artist will also be shown to help you. 
          When you've submitted your answer (not case sensitive), press ENTER/RETURN and if you get it right, your score will increase.
        </label>
       </p>
       <span>
        <button onClick={() => {newScreenHidden(true)}}>
          GOT IT!
        </button>
       </span>
        </span>
      </header>
    </div>

  )
  

  return pageLoaded;


  }
export default StartScreen;


