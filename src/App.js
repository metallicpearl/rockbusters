// import logo from './logo.svg';
import React, { useEffect, useState, useRef, styles } from 'react';
import './App.css';
import logo from './files/karl.svg';
import rb2 from './files/RockBustersLogo2.png'
import { GetQuestionAndAnswer } from './questionandanswerconstants';
import { Button, ToggleButton } from 'react-bootstrap';
import { useSound } from 'use-sound';
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
import { Process } from './processscores.js';




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
let dotNumber = "";
let addingDots = false;
let loadingTimeElapsed = 0;

let isLoaded = false;
let currentIndex;
let workingArray = [];
let backupState = ["", ""];
let clueGenerated = false;
let answerHold = "";
let nameInput = "";

let nameEntered = false;

let [finalScore, finalTime] = [0, 0];

var Toggle = require('react-toggle')

const alt =
  `That woman's got her husbands gloves and a pair of her own. (HH) = Herman's Hermits (her man's, her mitts)
Do you think your kid will get that strawberry for me? (WP) = Wilson Picket (will son pick it?)
Me granny's taking a penalty. She better get the ball in the back of the net. (NM) = Nana Mouskouri (nanna must score 'ere)`;
var altArray = alt.split(/\r?\n/);

function secondsToTime(e) {
  const h = Math.floor(e / 3600).toString().padStart(2, '0'),
    m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
    s = Math.floor(e % 60).toString().padStart(2, '0');

  return `${h}:` + `${m}:` + `${s}`
}


const nameTextStyle1 = {
  paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'grey', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 35, textRendering: 'optimizeLegibility'
}

const nameTextStyle2 = {
  paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bold", fontSize: 35, textRendering: 'optimizeLegibility'
}

const nameTextStyleMobile = {
  paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bold", fontSize: 22, textRendering: 'optimizeLegibility'
}




function App() {
  let [soundPlayingState, soundPlayingNewState] = useState(false);
  let [musicPlayingState, musicPlayingNewState] = useState(false);
  let [playTheme, { sound }] = useSound(theme);
  let [playSound] = useSound(soundToPlay, { volume: 0.75, onend: function () { soundPlayingNewState(false); } });
  let [state, setState] = useState(q);
  let [mainContentHiddenState, mainContentHiddenNewState] = useState(true);
  let [startContentHiddenState, startContentHiddenNewState] = useState(false);
  let [clueState, clueNewState] = useState();
  let [tallyState, tallyNewState] = useState(0);
  let [showAnswerState, updateShowAnswerState] = useState(true);
  let [answerInputHidden, updateAnswerInputHidden] = useState(false);
  let [clueHideState, clueHideNewState] = useState(false);
  let [buttonHideState, buttonHideNewState] = useState(false);
  let [questionHiddenState, questionNewHiddenState] = useState(false);
  let [endHiddenState, endNewHiddenState] = useState(true);
  let [isHover, setIsHover] = useState();
  let [buttonIsHover, setButtonIsHover] = useState();
  let [soundButtonIsHover, setSoundButtonIsHover] = useState();
  let [soundButtonColour, setSoundButtonColour] = useState('#ff9933');
  let [soundButtonText, setSoundButtonText] = useState("Sounds OFF");
  let [soundButtonFontColour, soundButtonSetFontColour] = useState("black");
  let [questionsCount, setQuestionsCount] = useState(25);
  let answerInput = useRef(null);
  let [nextQuestionReady, setNextQuestionReady] = useState(true);
  let [finishIsHover, setFinishIsHover] = useState();
  let [clock, setClock] = useState("0:00");
  let [dots, dotsAdded] = useState("");
  let [thankyouContentHiddenState, thankyouContentSetHiddenState] = useState(true)
  let [nameStateStyle, setNameStateStyle] = useState(nameTextStyle2);
  let [results, setResults] = useState("Fetching top 10 scores...");
  let [resultsHiddenState, setResultsHiddenState] = useState(true);
  let [finishButtonHideState, finishButtonNewHideState] = useState(false);


  React.useEffect(() => {
    secondsElapsed++;
    const timer =
      setInterval(() => setClock(
        secondsElapsed
      ), 1000);
    return () => clearInterval(timer);
  }, [clock]);


  // React.useEffect(() => {
  //   dotNumber++;
  //   const timer2 =
  //     setInterval(() => dotsAdded(() => {
  //       for (var x = 0; addingDots == true; dotNumber++) {
  //         dotsAdded(dots+=".");
  //       }
  //     }
  //     ), 500);
  //   return () => clearInterval(timer2);
  // }, [dots]);



  if (isLoaded == false) {
    workingArray = GetQuestionAndAnswer(questionsCount);
    currentIndex = 0;
    backupState[0] = q;

    total = (workingArray.length);//
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
    if (workingArray.length >= 0) {
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
        if (isLoaded == true && nextQuestionReady == true && workingArray.length > 0) {
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



      if (workingArray.length == 0) {
        questionNewHiddenState(true);
        endNewHiddenState(false);
        updateAnswerInputHidden(true);
        buttonHideNewState(true);
        finishButtonNewHideState(false);
      }
    }

  };




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
        if (soundButtonText == "Sounds ON" && soundPlayingState != true) {
          playSound();
          soundPlayingNewState(true);
        }
      }
    }
  }



  var handleSoundButtonClick = () => {

    if (soundButtonText == "Sounds OFF") {
      setSoundButtonText("Sounds ON");
      setSoundButtonColour('#ff4f0e');
      soundButtonSetFontColour('white');
    }

    if (soundButtonText == "Sounds ON") {
      setSoundButtonText("Sounds OFF");
      soundPlayingNewState(false);
      setSoundButtonColour('#ff9933');
      soundButtonSetFontColour('black');
    }


  }


  var value = soundDetails.length;
  var soundsJumbled =
    soundDetails
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  soundToPlay = soundsJumbled[0];


  const headerTextStyle1 = {
    paddingLeft: 20, paddingRight: 20, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 140, textRendering: 'optimizeLegibility', maxWidth: 100, border: "8px dotted"
  }


  const headerTextStyleTablet = {
    paddingLeft: 20, paddingRight: 20, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 90, textRendering: 'optimizeLegibility', maxWidth: 100, border: "8px dotted"
  }


  const headerTextStyleMobile = {
    paddingLeft: 20, paddingRight: 20, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 35, textRendering: 'optimizeLegibility', maxWidth: 100, border: "8px dotted"
  }

  const headerTextStyle2 = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 120, textRendering: 'optimizeLegibility', maxWidth: 100
  }

  const headerTextStyle2Mobile = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 30, textRendering: 'optimizeLegibility', maxWidth: "100%"
  }

  const welcomeTextStyle = {
    paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 30, textRendering: 'optimizeLegibility', maxWidth: 100
  }

  const welcomeTextStyleTablet = {
    paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 25, textRendering: 'optimizeLegibility', maxWidth: 100
  }


  const welcomeTextStyleMobile = {
    paddingRight: 5, paddingeft: 5, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 13, textRendering: 'optimizeLegibility', maxWidth: 100
  }
 


  const questionTextStyle = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 40, textRendering: 'optimizeLegibility'
  }


  const questionTextStyleTablet = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 30, textRendering: 'optimizeLegibility'
  }


  const questionTextStyleMobile = {
    maxWidth: "90%", borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bolder", fontSize: 18, textRendering: 'geometricPrecision'
  }

  const answerTextStyle = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: '#4a6061', backgroundColor: 'white', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 39, textRendering: 'optimizeLegibility'
  }

  const answerTextStyleTablet = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: '#4a6061', backgroundColor: 'white', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 28, textRendering: 'optimizeLegibility'
  }



  const answerTextStyleMobile = {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, color: '#4a6061', backgroundColor: 'white', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 18, textRendering: 'optimizeLegibility'
  }

  const soundButtonStyle =
  {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, marginBottom: 40, width: 180, marginLeft: 4, marginRight: 10, backgroundColor: soundButtonIsHover ? '#ff4f0e' : soundButtonColour, borderRadius: 5, border: "5px dotted", fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: soundButtonIsHover ? { soundButtonFontColour } : { soundButtonFontColour },
  }



  const cardStyle = {
    backgroundColor: 'grey'
  }

  let pageLoaded = (

    <div className="App" position="fixed" style={{ maxWidth: '100%', maxHeight: '100%', color: 'black', flex: 'auto'}}>
      <header className="App-header" >
        <span id="startContent" hidden={startContentHiddenState} style={{color: 'black', paddingBottom: 50 }}>
          <label style={{ fontSize: "4px" }}>
            <br />
          </label>
          <span>
            <span>
              <label style={headerTextStyle1} onClick={() => { if (musicPlayingState == false) { playTheme(); musicPlayingNewState(true) } }}>
                ROCKBUSTERS <br />
              </label>
            </span>
            <span>
              <label style={{ fontSize: 18 }}>
                (click the title for a poor theme tune) <br />
              </label>
            </span>
          </span>
          <p style={{ padding: 40 }}>
            <label style={questionTextStyle}>
              HOW TO PLAY: <br /> <br />
            </label>
            <label style={welcomeTextStyle}>
              The 'cryptic' clue given SHOULD refer to a band or artist (except the clues are often rubbish, so good luck). The initials of the artist are also shown to help you but this doesn't always help, sadly.
              When you've written your answer (not case sensitive), press ENTER/RETURN and if you get it right, your score will increase.  If you can't work out an answer, click 'BONG!' - this will reveal it. If you don't know the answer, click the question to skip to the next question.<br /> <br />
              If you turn on sounds, there are some classic 'annoyed Ricky' moments from the podcasts (basically him berating Karl) which will play as a little reward if you get your question right. <br /> <br />
              You will have 25 questions to answer - there are many more questions than this so if you want to try different questions, refresh the page!<br /><br />
              If you enter your name in the text box before clicking 'START', your score will be recorded and you can view your score amongst your peers at the end IF you make the top 10 :).



            </label>
          </p>
          <span>
            <input id='nameText' onChange={(event) => { nameInput = event.target.value }}
              style={nameStateStyle}>
            </input>
            <label style={{ marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgreen' : 'green', width: 200, border: '4px dotted', borderColor: buttonIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { startContentHiddenNewState(true); mainContentHiddenNewState(false); secondsElapsed = 0; sound.fade(0.6, 0.0, 3000); }}>
              {" START "}
            </label>
          </span>
        </span>

        <span id="main-Content" hidden={mainContentHiddenState} style={{maxWidth: '90%'}}>
          <img src={rb2} className="App-background" style={{maxWidth: '100%'}}/>

          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <label hidden={questionHiddenState}
              onClick={handleChange} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}
              style={questionTextStyle}>
              {"`" + state + "`" + "      ('" + c + "')"}
            </label>
            <label hidden={endHiddenState}
              style={questionTextStyle}>
              You know what you've done there, dont you? You've put the nail in the coffin of Rockbusters. No more questions left, play a record!
            </label>
          </p>
          <span style={{maxWidth: '90%'}}>
            <label style={soundButtonStyle} onClick={handleSoundButtonClick} onMouseEnter={handleSoundButtonHoverIn} onMouseLeave={handleSoundButtonHoverOut} hidden={buttonHideState}>
              {soundButtonText}
            </label>
            <input id='answerText' hidden={answerInputHidden}
              type="text" ref={answerInput} onChange={(event) => { updateAnswerState(event.target.value); }} onKeyDown={(event) => { if (event.key == 'Enter') { checkAnswer() }; }}
              style={{ marginRight: 5, alignContent: 'center', width: 520, backgroundColor: 'beige', borderRadius: 5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 35 }}>
            </input>
            <label
              style={answerTextStyle} hidden={showAnswerState} >
              {"Answer: " + "'" + a + "'"}
            </label>
            <label onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { updateShowAnswerState(false); updateAnswerInputHidden(true); clueHideNewState(true); buttonHideNewState(true); }} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'tomato' : 'orangered', width: 100, border: '4px dotted', borderColor: buttonIsHover ? 'tomato' : 'orangered', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center', marginInline: 5 }}>
              {" BONG "}
            </label>
            <label onClick={async () => { addingDots = true;[finalScore, finalTime] = [tallyState, secondsElapsed]; console.log([finalScore, finalTime]); mainContentHiddenNewState(true); startContentHiddenNewState(true); thankyouContentSetHiddenState(false); setResultsHiddenState(false); setResults(await Process([finalScore, finalTime, nameInput])); dotsAdded(".") }} onMouseEnter={handleFinishHoverIn} onMouseLeave={handleFinishHoverOut} hidden={finishButtonHideState} style={{ whiteSpace: 'pre-wrap', marginRight: 20, borderRadius: 5, backgroundColor: finishIsHover ? 'lightgreen' : 'green', width: 100, border: '4px dotted', borderColor: finishIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center' }}>
              {" FINISH "}
            </label>
          </span>
          <p>
            <span style={{ marginTop: 40 }}>
              <label className="App-Tally"
                style={{ fontWeight: "bolder", border: "3px solid", paddingLeft: 15, paddingRight: 10, borderRadius: 5, marginRight: 2, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 45, textRendering: 'optimizeLegibility', maxWidth: 100 }}>
                Score: {tallyState} / {total}
              </label>
            </span>
          </p>
        </span>

        <div id="ThankyouContent" hidden={thankyouContentHiddenState} style={{ width: '100%', color: 'black' }}>
          <label style={headerTextStyle2}>
            THANKYOU FOR PLAYING :)
          </label>

          <p style={{ padding: 20, marginBottom: 20 }}>
            <label style={welcomeTextStyle}>
              Refresh the page if you want to play again!
            </label>
          </p>
        </div>
        <label style={{ fontSize: 4 }}>
          <br />
        </label>
        <div id="ResultContent" hidden={resultsHiddenState} style={{ fontFamily: "calibri", border: "4px solid", color: 'black', fontWeight: "bolder" }}>
        <span style={{ width: 1200 }}>
          <pre style={{ width: 1200,
             borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 30, textRendering: 'optimizeLegibility'
          }}>
            <label style={{borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bold", fontSize: 80, textRendering: 'optimizeLegibility'}}>
              TOP 10 SCORES<br />
            </label>
            {results}
          </pre>

        </span>

        </div>


      </header>

    </div>

  )


    
  let tabletPageLoaded = (

    <div className="App" position="fixed">
      <header className="App-header">
        <span id="startContent" hidden={startContentHiddenState} style={{ maxWidth: '100%', color: 'black', paddingBottom: 10}}>
          <label style={{ fontSize: "4px" }}>
            <br />
          </label>
          <span>
            <span>
              <label style={headerTextStyleTablet} onClick={() => { if (musicPlayingState == false) { playTheme(); musicPlayingNewState(true) } }}>
                ROCKBUSTERS<br />
              </label>
            </span>
          </span>
          <p style={{ padding: 40 }}>
            <label style={questionTextStyle}>
              HOW TO PLAY: <br /> <br />
            </label>
            <label style={welcomeTextStyle}>
              The 'cryptic' clue given SHOULD refer to a band or artist (except the clues are often rubbish, so good luck). The initials of the artist are also shown to help you but this doesn't always help, sadly.
              When you've written your answer (not case sensitive), press 'SUBMIT' and if you get it right, your score will increase.  If you can't work out an answer, click 'BONG!' - this will reveal it. If you don't know the answer, click the question to skip to the next question.<br /> <br />
              If you turn on sounds, there are some classic 'annoyed Ricky' moments from the podcasts (basically him berating Karl) which will play as a little reward if you get your question right. <br /> <br />
              You will have 25 questions to answer - there are many more questions than this so if you want to try different questions, refresh the page!<br /><br />
              If you enter your name in the text box before clicking 'START', your score will be recorded and you can view your score amongst your peers at the end IF you make the top 10 :).



            </label>
          </p>
          <span>
            <input id='nameText' onChange={(event) => { nameInput = event.target.value }}
              style={nameStateStyle}>
            </input>
            <label style={{ marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgreen' : 'green', width: 200, border: '4px dotted', borderColor: buttonIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { startContentHiddenNewState(true); mainContentHiddenNewState(false); secondsElapsed = 0; sound.fade(0.6, 0.0, 3000); }}>
              {" START "}
            </label>
          </span>
        </span>

        <span id="main-Content" hidden={mainContentHiddenState} style={{maxWidth: '90%'}}>
          <img src={rb2} className="App-background" />

          <img src={logo} className="App-logo" alt="logo" />
          <span maxWidth="90%">
          <p>
            <label hidden={questionHiddenState}
              onClick={handleChange} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}
              style={questionTextStyleTablet}>
              {"`" + state + "`" + "      ('" + c + "')"}
            </label>
            <label hidden={endHiddenState}
              style={questionTextStyleTablet}>
              You know what you've done there, dont you? You've put the nail in the coffin of Rockbusters. No more questions left, play a record!
            </label>
          </p>
          </span>
          <span>
            <input id='answerText' hidden={answerInputHidden}
              type="text" ref={answerInput} onChange={(event) => { updateAnswerState(event.target.value); }} onKeyDown={(event) => { if (event.key == 'Enter') { checkAnswer() }; }}
              style={{ alignContent: 'center', width: "70%", backgroundColor: 'beige', borderRadius:5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 35}}>
            </input>
            <label onClick={async () => { checkAnswer();}} hidden={buttonHideState} style={{ paddingTop: 1, whiteSpace: 'pre-wrap', margin: 5, borderRadius: 5, backgroundColor: finishIsHover ? 'lightgreen' : 'green', width: 100, border: '5px dotted', borderColor: finishIsHover ? 'lightgreen' : 'green', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 34, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center' }}>
              {" SUBMIT "}
            </label>
            <label
              style={answerTextStyleTablet} hidden={showAnswerState} >
              {"Answer: " + "'" + a + "'"}
            </label>
            <p>
            <span>
            <label onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { updateShowAnswerState(false); updateAnswerInputHidden(true); clueHideNewState(true); buttonHideNewState(true); }} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'tomato' : 'orangered', width: 100, border: '4px dotted', borderColor: buttonIsHover ? 'tomato' : 'orangered', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center', marginInline: 5 }}>
              {" BONG "}
            </label>
            <label onClick={async () => { addingDots = true;[finalScore, finalTime] = [tallyState, secondsElapsed]; console.log([finalScore, finalTime]); mainContentHiddenNewState(true); startContentHiddenNewState(true); thankyouContentSetHiddenState(false); setResultsHiddenState(false); setResults(await Process([finalScore, finalTime, nameInput])); dotsAdded(".") }} onMouseEnter={handleFinishHoverIn} onMouseLeave={handleFinishHoverOut} hidden={finishButtonHideState} style={{ whiteSpace: 'pre-wrap', marginRight: 20, borderRadius: 5, backgroundColor: finishIsHover ? 'lightgreen' : 'green', width: 100, border: '4px dotted', borderColor: finishIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center' }}>
              {" FINISH "}
            </label>
            </span>
            </p>
          </span>
          
          <p>
            <span style={{ marginTop: 40 }}>
              <label className="App-Tally"
                style={{ fontWeight: "bolder", border: "3px solid", paddingLeft: 15, paddingRight: 10, borderRadius: 5, marginRight: 2, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 45, textRendering: 'optimizeLegibility', maxWidth: 100 }}>
                Score: {tallyState} / {total}
              </label>
            </span>
          </p>
        </span>

        <div id="ThankyouContent" hidden={thankyouContentHiddenState} style={{ color: 'black' }}>
          <label style={headerTextStyle2}>
            THANKYOU FOR PLAYING :)
          </label>

          <p style={{ padding: 20, marginBottom: 20 }}>
            <label style={welcomeTextStyle}>
              Refresh the page if you want to play again!
            </label>
          </p>
        </div>
        <label style={{ fontSize: 4 }}>
          <br />
        </label>
        <div id="ResultContent" hidden={resultsHiddenState} style={{ fontFamily: "calibri", border: "4px solid", color: 'black', fontWeight: "bolder",  width: 768, fontWeight: "bolder"}}>
        <span>
        <pre style={{
             borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 24, textRendering: 'optimizeLegibility'
          }}>
            <label style={{borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bold", fontSize: 38, textRendering: 'optimizeLegibility'}}>
              TOP 10 SCORES<br />
            </label>
            {results}
          </pre>
        </span>
       
        </div>

      </header>

    </div>
  )


  let mobilePageLoaded = (

    <div className="App-mobile" position="fixed">
      <header className="App-header-mobile" >
        <span id="startContent" hidden={startContentHiddenState} style={{ width: '100%', color: 'black', paddingBottom: 10}}>
          <label style={{ fontSize: "4px" }}>
            <br />
          </label>
          <span>
            <span>
              <label style={headerTextStyleMobile}>
                ROCKBUSTERS<br />
              </label>
            </span>

          </span>
          <p style={{ padding: 10 }}>
            <label style={questionTextStyleMobile}>
              HOW TO PLAY: <br /> <br />
            </label>
            <label style={welcomeTextStyleMobile}>
              The 'cryptic' clue given SHOULD refer to a band or artist (except the clues are often rubbish, so good luck). The initials of the artist are also shown to help you but this doesn't always help, sadly.
              When you've written your answer (not case sensitive), press 'SUBMIT' and if you get it right, your score will increase.  If you can't work out an answer, click 'BONG!' - this will reveal it. If you don't know the answer, click the question to skip to the next question.<br /> <br />
              If you turn on sounds, there are some classic 'annoyed Ricky' moments from the podcasts (basically him berating Karl) which will play as a little reward if you get your question right. <br /> <br />
              You will have 25 questions to answer - there are many more questions than this so if you want to try different questions, refresh the page!<br /><br />
              If you enter your name in the text box before clicking 'START', your score will be recorded and you can view your score amongst your peers at the end IF you make the top 10 :).
            </label>
          </p>
          <span>
            <input id='nameText' onChange={(event) => { nameInput = event.target.value }}
              style={nameTextStyleMobile}>
            </input>
            <label style={{ paddingTop: 3, marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgreen' : 'green', width: 200, border: '4px dotted', borderColor: buttonIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 18, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { startContentHiddenNewState(true); mainContentHiddenNewState(false); secondsElapsed = 0; sound.fade(0.6, 0.0, 3000); }}>
              {" START "}
            </label>
          </span>
        </span>

        <span id="main-Content" hidden={mainContentHiddenState}>
          <img src={rb2} className="App-background-mobile"/>

          <img src={logo} className="App-logo-mobile" alt="logo-mobile"/>
          <p>
            <span maxWidth="90%">
            <label hidden={questionHiddenState}
              onClick={handleChange} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}
              style={questionTextStyleMobile}>
            {"`" + state + "`" + "      ('" + c + "')"}
            </label>
            <label hidden={endHiddenState}
              style={questionTextStyleMobile}>
              You know what you've done there, dont you? You've put the nail in the coffin of Rockbusters. No more questions left, play a record!
            </label>
            </span>
          </p>
          <span maxWidth="90%">
            <input id='answerText' hidden={answerInputHidden}
              type="text" ref={answerInput} onChange={(event) => { updateAnswerState(event.target.value); }} onKeyDown={(event) => { if (event.key == 'Enter') { checkAnswer() }; }}
              style={{ alignContent: 'center', width: "70%", backgroundColor: 'beige', borderRadius: 5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 22, borderRadius: 5}}>
            </input>
            <label onClick={async () => { checkAnswer();}} hidden={buttonHideState} style={{ margin: 10, marginInline:5, whiteSpace: 'pre-wrap', borderRadius:5, backgroundColor: finishIsHover ? 'lightgreen' : 'green', border: '4px dotted', borderColor: finishIsHover ? 'lightgreen' : 'green', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 18, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center', paddingTop: 3 }}>
              {" SUBMIT "}
            </label>
            </span>
            <p>
              <span>
            <label
              style={answerTextStyleMobile} hidden={showAnswerState} >
              {"Answer: " + "'" + a + "'"}
            </label>
            <label onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { updateShowAnswerState(false); updateAnswerInputHidden(true); clueHideNewState(true); buttonHideNewState(true); }} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'tomato' : 'orangered', width: 100, border: '4px dotted', borderColor: buttonIsHover ? 'tomato' : 'orangered', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 18, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center', marginInline: 5 }}>
              {" BONG "}
            </label>
            <label onClick={async () => { addingDots = true;[finalScore, finalTime] = [tallyState, secondsElapsed]; console.log([finalScore, finalTime]); mainContentHiddenNewState(true); startContentHiddenNewState(true); thankyouContentSetHiddenState(false); setResultsHiddenState(false); setResults(await Process([finalScore, finalTime, nameInput])); dotsAdded(".") }} onMouseEnter={handleFinishHoverIn} onMouseLeave={handleFinishHoverOut} hidden={finishButtonHideState} style={{ whiteSpace: 'pre-wrap', marginRight: 20, borderRadius: 5, backgroundColor: finishIsHover ? 'lightgreen' : 'green', width: 100, border: '4px dotted', borderColor: finishIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 18, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center' }}>
              {" FINISH "}
            </label>
            </span>
          </p>
          <p>
            <span style={{ marginTop: 40 }}>
              <label className="App-Tally"
                style={{ fontWeight: "bolder", border: "3px solid", paddingLeft: 15, paddingRight: 10, borderRadius: 5, marginRight: 2, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 20, textRendering: 'optimizeLegibility', maxWidth: 100 }}>
                Score: {tallyState} / {total}
              </label>
            </span>
          </p>
        </span>

        <div id="ThankyouContent" hidden={thankyouContentHiddenState} style={{ width: 320, color: 'black' }}>
          <label style={headerTextStyle2Mobile}>
            THANKYOU FOR PLAYING :)
          </label>

          <p style={{ paddingLeft: 20, paddingRight: 20, marginBottom:0 }}>
            <label style={welcomeTextStyleMobile}>
              Refresh the page if you want to play again!
            </label>
          </p>
        </div>
        <label style={{ fontSize: 4 }}>
          <br />
        </label>
        <div id="ResultContent" hidden={resultsHiddenState} style={{ fontFamily: "calibri", border: "4px solid", width: 320, color: 'black', fontWeight: "bolder" }}>
        <span style={{ width: 320 }}>
          <pre style={{
             borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 14, textRendering: 'optimizeLegibility'
          }}>
            <label style={{borderRadius: 5, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontWeight: "bold", fontSize: 28, textRendering: 'optimizeLegibility'}}>
              TOP 10 SCORES<br />
            </label>
            {results}
          </pre>

        </span>

        </div>


      </header>

    </div>

  )



  const isAppDisabled = window.matchMedia('(min-width: 1366px)').matches;
  const isTabletEnabled = window.matchMedia('(min-width: 768px').matches;
  const isMobileEnabled = window.matchMedia('(min-width: 320px').matches;

  if (!isAppDisabled && !isTabletEnabled && !isMobileEnabled) {
    return [
      <header className="App-header">
        <div>
          <label>
            Sorry - this page isn't designed for use below 320px.
          </label>
        </div>
      </header>
    ]
  }

  if ((isTabletEnabled && isMobileEnabled) && !isAppDisabled) {
    return tabletPageLoaded
  }
  if (isMobileEnabled && (!isTabletEnabled && !isAppDisabled)) {
    return mobilePageLoaded
  }
  else {
    return pageLoaded
  }



}





export default App;


