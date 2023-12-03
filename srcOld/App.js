// import logo from './logo.svg';
import React, { useEffect, useState, useRef, styles } from 'react';
import { ReactComponentElement, Component } from 'react';
import './App.css';
import logo from './files/karl.svg';
import rb from './files/RockBustersLogo.svg';
import rb2 from './files/RockBustersLogo2.png'
import { GetQuestionAndAnswer } from './questionandanswerconstants';
import { Button, ToggleButton } from 'react-bootstrap';
import { Backdrop, Box, Card } from '@mui/material';
import { blueGrey, grey } from '@mui/material/colors';
import { hasPointerEvents } from '@testing-library/user-event/dist/utils';
import { fontGrid } from '@mui/material/styles/cssUtils';
import useSound from 'use-sound';
import theme from './files/sounds/rbtheme.mp3';
import rska from './files/sounds/rsk-001.mp3';
import rskb from './files/sounds/rsk-002.mp3';
import rskc from './files/sounds/rsk-003.mp3';
import rskd from './files/sounds/rsk-004.mp3';
import rske from './files/sounds/rsk-005.mp3';
import rskf from './files/sounds/rsk-006.mp3';
import rskg from './files/sounds/rsk-007.mp3';
import rskh from './files/sounds/rsk-008.mp3';
import rski from './files/sounds/rsk-009.mp3';
import { dark } from '@mui/material/styles/createPalette';

let pq = "";
let q;
let a;
let c;
let ae;
let tally;
let total;
let textPadding = 0;
var soundDetails = [rska, rskb, rskc, rskd, rske, rskf, rskg, rskh, rski];
let soundToPlay = "";
let secondsElapsed = 0;

let isLoaded = false;
let currentIndex;
let workingArray = [];
let backupState = ["", ""];
let clueGenerated = false;
let answerHold = "";

var Toggle = require('react-toggle')



const alt =
  `That woman's got her husbands gloves and a pair of her own. (HH) = Herman's Hermits (her man's, her mitts)
Do you think your kid will get that strawberry for me? (WP) = Wilson Picket (will son pick it?)
Me granny's taking a penalty. She better get the ball in the back of the net. (NM) = Nana Mouskouri (nanna must score 'ere)`;
var altArray = alt.split(/\r?\n/);

function App() {
  let [musicVolVal, newMusicVolVal] = useState(0.75);
  let [soundPlayingState, soundPlayingNewState] = useState(false);
  let [musicPlayingState, musicPlayingNewState] = useState(false);
  let [playTheme, { stop: stopMusic }] = useSound(theme, { loop: true, volume: musicVolVal });
  let [playSound] = useSound(soundToPlay, { onend: () => { { newMusicVolVal(0.75); soundPlayingNewState(false) } } });
  let [state, setState] = useState(q);
  let [mainContentHiddenState, mainContentHiddenNewState] = useState(true);
  let [startContentHiddenState, startContentHiddenNewState] = useState(false);
  let [endContentHiddenState, setEndContentHiddenState] = useState(true);
  let [clueState, clueNewState] = useState();
  let [answerState, answerNewState] = useState();
  let [tallyState, tallyNewState] = useState(0);
  let [answerInputState, answerInputNewState] = useState();
  let [showAnswerState, updateShowAnswerState] = useState(true);
  let [answerInputHidden, updateAnswerInputHidden] = useState(false);
  let [clueHideState, clueHideNewState] = useState(false);
  let [buttonHideState, buttonHideNewState] = useState(false);
  let [questionHiddenState, questionNewHiddenState] = useState(false);
  let [endHiddenState, endNewHiddenState] = useState(true);
  let [isHover, setIsHover] = useState();
  let [buttonIsHover, setButtonIsHover] = useState();
  let [musicButtonIsHover, setMusicButtonIsHover] = useState();
  let [soundButtonIsHover, setSoundButtonIsHover] = useState();
  let [musicButtonColour, setMusicButtonColour] = useState('#b3d2b0');
  let [soundButtonColour, setSoundButtonColour] = useState('#b3d2b0');
  let [easyButtonIsHover, setEasyButtonIsHover] = useState();
  let [mediumButtonIsHover, setMediumButtonIsHover] = useState();
  let [hardButtonIsHover, setHardButtonIsHover] = useState();
  let [easyButtonColour, setEasyButtonColour] = useState('green');
  let [mediumButtonColour, setMediumButtonColour] = useState('#b3d2b0');
  let [hardButtonColour, setHardButtonColour] = useState('#b3d2b0');
  let [musicButtonText, setMusicButtonText] = useState("Music OFF");
  let [soundButtonText, setSoundButtonText] = useState("Sound OFF");
  let [gameMode, setGameMode] = useState("easy");
  let [questionsCount, setQuestionsCount] = useState(25);
  let answerInput = useRef(null);
  let [nextQuestionReady, setNextQuestionReady] = useState(true);
  let [finishIsHover, setFinishIsHover] = useState();
  let [clock, setClock] = useState("0:00");


  function secondsToTime(e){
    const h = Math.floor(e / 3600).toString().padStart(2,'0'),
          m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(e % 60).toString().padStart(2,'0');

    return `${h}:`+`${m}:`+`${s}`
        }

  React.useEffect(() => {
    secondsElapsed++;
    var newTime = secondsToTime(secondsElapsed);
    const timer =
      setInterval(() => setClock(
        newTime
        ), 1000);
      return () => clearInterval(timer);
    }, [clock]);

  if (isLoaded == false) {

    workingArray = GetQuestionAndAnswer(questionsCount);
    currentIndex = 0;
    backupState[0] = q;

    total = (workingArray.length);// + (altArray.length);
    tally = 0;

    var x = workingArray[0].toString();
    q = x.slice(0, x.indexOf("(")).trim();
    c = x.slice(x.indexOf("(") + 1, x.indexOf(")"));
    a = x.slice(x.indexOf("=") + 1).trim();

    workingArray.shift();
    backupState[1] = q;
    setState(q);
    clueNewState("");
    updateShowAnswerState(true);
    isLoaded = true;
    textPadding = 0;
    buttonHideNewState(false);


  }
  var handleChange = () => {
    if (workingArray.length > 0) {
      if (q != undefined) {
        if (!isLoaded) {
          setNextQuestionReady(false);
          workingArray = GetQuestionAndAnswer();
          currentIndex = 0;
          backupState[0] = q;
          var x = workingArray[0].toString();
          q = x.slice(0, x.indexOf("(")).trim();
          c = x.slice(x.indexOf("(") + 1, x.indexOf(")"));
          a = x.slice(x.indexOf("=") + 1).trim();
          workingArray.shift();
          backupState[1] = q;
          setState(q);
          tallyNewState(0);
          updateShowAnswerState(true);
          isLoaded = true;
          updateAnswerInputHidden(false);
          clueHideNewState(false);
          buttonHideNewState(false);
          setNextQuestionReady(true);
        }
        if (isLoaded == true && nextQuestionReady == true) {
          setNextQuestionReady(false);
          backupState[0] = q;
          var x = workingArray[0].toString();
          q = x.slice(0, x.indexOf("(")).trim();
          c = x.slice(x.indexOf("(") + 1, x.indexOf(")"));
          a = x.slice(x.indexOf("=") + 1).trim();
          workingArray.shift();
          backupState[1] = q;
          currentIndex--;
          setState(q);
          answerInput.current.value = "";
          updateShowAnswerState(true);
          setIsHover(false);
          updateAnswerInputHidden(false);
          clueHideNewState(false);
          buttonHideNewState(false);
          setNextQuestionReady(true);
        }

        clueNewState("");
        clueGenerated = false;
        textPadding = 0;
      }

    }
    //if (q == '' || (workingArray.length == 0 && altArray.length > 0)) {
    // {
    //   var indexRandom = Math.floor(Math.random() * altArray.length);
    //   q = altArray[indexRandom].slice(0, altArray[indexRandom].indexOf("(")).trim();
    //   c = altArray[indexRandom].slice(altArray[indexRandom].indexOf("(") + 1, altArray[indexRandom].indexOf(")"));
    //   a = altArray[indexRandom].slice(altArray[indexRandom].indexOf("=") + 1).trim();
    //   altArray.shift();
    //   setState(q);
    // }

    if (workingArray.length == 0 && altArray.length == 0) {
      questionNewHiddenState(true);
      endNewHiddenState(false);

    }

    // }


  };



  var handleEasyButtonClick = () => {

    setGameMode("easy");
    setEasyButtonColour('green');
    setMediumButtonColour('#b3d2b0');
    setHardButtonColour('#b3d2b0');
    setQuestionsCount(25);

  }

  var handleMediumButtonClick = () => {

    setGameMode("medium");
    setEasyButtonColour('#b3d2b0');
    setMediumButtonColour('orange');
    setHardButtonColour('#b3d2b0');
    setQuestionsCount(50);

  }

  var handleHardButtonClick = () => {

    setGameMode("hard");
    setEasyButtonColour('#b3d2b0');
    setMediumButtonColour('#b3d2b0');
    setHardButtonColour('red');
    setQuestionsCount(75);

  }

  const handleMusicButtonHoverIn = () => {
    setMusicButtonIsHover(true);
  }

  const handleMusicButtonHoverOut = () => {
    setMusicButtonIsHover(false);
  }

  const handleSoundButtonHoverIn = () => {
    setSoundButtonIsHover(true);
  }

  const handleSoundButtonHoverOut = () => {
    setSoundButtonIsHover(false);
  }


  const handleFinishHoverIn = () => {
    setFinishIsHover(true);
  }

  const handleFinishHoverOut = () => {
    setFinishIsHover(false);
  }



  const handleHoverIn = () => {
    setIsHover(true);
  }

  const handleHoverOut = () => {
    setIsHover(false);
  }

  const handleButtonHoverIn = () => {
    setButtonIsHover(true);
  }

  const handleButtonHoverOut = () => {
    setButtonIsHover(false);
  }


  const updateAnswerState = (x) => {
    if (x != undefined) {
      answerHold = x;
    }
  };

  var checkAnswer = () => {
    var ae = "";
    if (answerHold != undefined) {
      var ind = a.indexOf("(");
      if (ind == -1 || ind == undefined) {
        ae = a;
      }
      if (ind > -1) {
        ae = a.split("(")[0].trim();
      }
      if ((answerHold.toLowerCase() == ae.toLowerCase())) {
        tallyNewState(tallyState + 1);

        handleChange();
        if (soundButtonText == "Sound ON" && soundPlayingState != true) {
          if (musicPlayingState == true) {
            newMusicVolVal(0.2);
          }
          playSound();
          soundPlayingNewState(true);
        }
      }
    }
  }


  var handleMusicButtonClick = () => {
    if (musicButtonText == "Music OFF") {
      setMusicButtonText("Music ON");
      newMusicVolVal(0.75);
      if (soundPlayingState == true) {
        newMusicVolVal(0.2);
      }

      playTheme();
      musicPlayingNewState(true);
      setMusicButtonColour('orange')
    }

    if (musicButtonText == "Music ON") {
      setMusicButtonText("Music OFF");
      stopMusic();
      musicPlayingNewState(false);
      setMusicButtonColour('#b3d2b0')
    }
  }

  var handleSoundButtonClick = () => {

    if (soundButtonText == "Sound OFF") {
      setSoundButtonText("Sound ON");
      setSoundButtonColour('orange');
    }

    if (soundButtonText == "Sound ON") {
      setSoundButtonText("Sound OFF");
      soundPlayingNewState(false);
      setSoundButtonColour('#b3d2b0');
    }


  }


  var value = soundDetails.length;
  var soundsJumbled =
    soundDetails
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  soundToPlay = soundsJumbled[0];


  const headerTextStyle = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 70, textRendering: 'optimizeLegibility', maxWidth: 500
  }

  const headerTextStyle2 = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 140, textRendering: 'optimizeLegibility', maxWidth: 100
  }


  const welcomeTextStyle = {
    paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 30, textRendering: 'optimizeLegibility', maxWidth: 100
  }

  const questionTextStyle = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 40, textRendering: 'optimizeLegibility', maxWidth: 100
  }

  const answerTextStyle = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: '#4a6061', backgroundColor: 'white', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 39, textRendering: 'optimizeLegibility', maxWidth: 100
  }

  const musicButtonStyle =
  {
    height: 40, width: 140, marginRight: 2, marginLeft: 9, backgroundColor: musicButtonIsHover ? 'orange' : musicButtonColour, borderRadius: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 25, fontWeight: 'bolder', color: 'black',
  }


  const welcomeSoundButtonStyle =
  {
    height: 40, width: 140, marginLeft: 2, marginRight: 10, backgroundColor: soundButtonIsHover ? 'orange' : soundButtonColour, borderRadius: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 25, fontWeight: 'bolder', color: 'black',
  }

  const easyModeButtonStyle =
  {
    height: 40, width: 160, marginLeft: 2, marginRight: 2, backgroundColor: easyButtonIsHover ? 'green' : easyButtonColour, borderRadius: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 25, fontWeight: 'bolder', color: 'black',
  }

  const mediumModeButtonStyle =
  {
    height: 40, width: 160, marginLeft: 2, marginRight: 2, backgroundColor: mediumButtonIsHover ? 'orange' : mediumButtonColour, borderRadius: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 25, fontWeight: 'bolder', color: 'black',
  }

  const hardModeButtonStyle =
  {
    height: 40, width: 160, marginLeft: 2, marginRight: 10, backgroundColor: hardButtonIsHover ? 'red' : hardButtonColour, borderRadius: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 25, fontWeight: 'bolder', color: 'black',
  }

  const soundButtonStyle =
  {
    height: 40, width: 140, marginLeft: 2, backgroundColor: soundButtonIsHover ? 'orange' : soundButtonColour, borderRadius: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 25, fontWeight: 'bolder', color: 'black',
  }



  const cardStyle = {
    backgroundColor: 'grey'
  }

  let pageLoaded = (

    <div className="App" position="fixed">
      <header className="App-header" >
        <span id="startContent" hidden={startContentHiddenState} style={{ border: "4px solid", width: 1200, color: 'black', paddingBottom: 50 }}>

          <label style={headerTextStyle}>
            WELCOME TO <br />
          </label>
          <label style={headerTextStyle2}>
            ROCKBUSTERS
          </label>

          <p style={{ padding: 40 }}>
            <label style={questionTextStyle}>
              HOW TO PLAY: <br />
            </label>
            <label style={welcomeTextStyle}>
              The 'cryptic' clue given SHOULD refer to a band or artist (except the clues are often rubbish, so good luck). The initials of the artist are also shown to help you but this doesn't always help, sadly.
              When you've written your answer (not case sensitive), press ENTER/RETURN and if you get it right, your score will increase. <br /> <br />
              Feel free to anoint your senses with a cheesy rendition of the for-legal-reasons-not-named TV show this pays homage to, which will play in a loop (you have been warned, though you can toggle on/off).
              Additionally, if you turn on sounds, there are some classic 'annoyed Ricky' moments from the podcasts (basically him berating Karl) which will play as a little reward if you get your question right. <br /> <br />
              You will have 25 questions to answer - there are many more questions than this so if you want to try different questions, refresh the page!<br /><br />

              If you can't work out an answer, click 'BONG!' - this will reveal it.
            </label>
          </p>
          <span>
            <Button style={musicButtonStyle} onClick={handleMusicButtonClick} onMouseEnter={handleMusicButtonHoverIn} onMouseLeave={handleMusicButtonHoverOut}>
              {musicButtonText}
            </Button>
            <Button style={welcomeSoundButtonStyle} onClick={handleSoundButtonClick} onMouseEnter={handleSoundButtonHoverIn} onMouseLeave={handleSoundButtonHoverOut}>
              {soundButtonText}
            </Button>

            <label style={{ colour: "black", fontSize: 30, height: 10, marginRight: 7 }}>
              |
            </label>
            <label style={{ padding: 5, marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgray' : 'green', width: 200, border: '4px dotted', borderColor: 'red', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { startContentHiddenNewState(true); mainContentHiddenNewState(false) }}>
              START
            </label>
          </span>
        </span>
        <span id="main-Content" hidden={mainContentHiddenState}>
          <span>
            <img src={rb2} className="App-background" />
          </span>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <label hidden={questionHiddenState}
              onClick={handleChange} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}
              style={questionTextStyle}>
              {"`" + state + "`" + "      ('" + c + "')"}
            </label>
            <label hidden={endHiddenState}
              style={questionTextStyle}>
              You know what you've done there, dont you? You've put the nail in the coffin of Rockbusters.
            </label>
          </p>
          <span>
            <input id='answerText' hidden={answerInputHidden}
              type="text" ref={answerInput} onChange={(event) => { updateAnswerState(event.target.value); }} onKeyDown={(event) => { if (event.key == 'Enter') { checkAnswer() }; }}
              style={{ alignContent: 'center', width: 520, backgroundColor: 'beige', borderRadius: 5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 28 }}>
            </input>
            <label onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { updateShowAnswerState(false); updateAnswerInputHidden(true); clueHideNewState(true); buttonHideNewState(true); }} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgray' : 'orangered', width: 100, border: '4px dotted', borderColor: 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }}>
              {" BONG! "}
            </label>
            <label
              style={answerTextStyle} hidden={showAnswerState} >
              {"Answer: " + "'" + a + "'"}
            </label>
            <p>
              <label onClick={() => { mainContentHiddenNewState(true); startContentHiddenNewState(true); setEndContentHiddenState(false); }} onMouseEnter={handleFinishHoverIn} onMouseLeave={handleFinishHoverOut} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: finishIsHover ? 'lightgray' : 'gray', width: 100, border: '4px dotted', borderColor: 'green', marginInline: 10, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center' }}>
                {"FINISH"}
              </label>
              <Button style={musicButtonStyle} onClick={handleMusicButtonClick} onMouseEnter={handleMusicButtonHoverIn} onMouseLeave={handleMusicButtonHoverOut}>
                {musicButtonText}
              </Button>
              <Button style={soundButtonStyle} onClick={handleSoundButtonClick} onMouseEnter={handleSoundButtonHoverIn} onMouseLeave={handleSoundButtonHoverOut}>
                {soundButtonText}
              </Button>
              <label className="App-Tally"
                style={{ fontWeight: "bolder", border: "4px solid black", marginInline: 105, marginLeft: 20, paddingLeft: 10, paddingRight: 10, borderRadius: 5, marginInline: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 40, textRendering: 'optimizeLegibility', maxWidth: 100 }}>
                Score: {tallyState} / {total}
              </label>
            </p>
    
            {/* <div alignContent="middle" marginTop style={{ fontWeight: "normal", paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 40, textRendering: 'optimizeLegibility'}}>
              Time elapsed: {clock}
              </div> */}

          </span>
        </span>
        <span id="EndContent" hidden={endContentHiddenState} style={{ border: "4px solid", width: 1200, color: 'black', paddingBottom: 50 }}>
          <label style={headerTextStyle2}>
            WELL DONE!
          </label>
          <p style={{ padding: 20 }}>
            <label style={welcomeTextStyle}>
              Your score is one of the top 25 scores recorded in this game. If you wish to record it for posterity, please put your name in the box below and click 'SAVE'.
            </label>
          </p>
          <p>
            <input id='nameText'
              type="text" ref={answerInput}
              style={{ alignContent: 'center', width: 520, backgroundColor: 'beige', borderRadius: 5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 28 }}>
            </input>
            <label style={{ padding: 5, marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgray' : 'green', width: 200, border: '4px dotted', borderColor: 'red', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { startContentHiddenNewState(true); mainContentHiddenNewState(false) }}>
              SAVE
            </label>
          </p>
        </span>
      </header>

    </div>

  )

  return pageLoaded;
}




export default App;


