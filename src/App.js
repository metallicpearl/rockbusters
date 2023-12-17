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
let loadingTimeElapsed = 0;

let isLoaded = false;
let currentIndex;
let workingArray = [];
let backupState = ["", ""];
let clueGenerated = false;
let answerHold = "";
let nameInput = "";

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


function App() {
  let [soundPlayingState, soundPlayingNewState] = useState(false);
  let [musicPlayingState, musicPlayingNewState] = useState(false);
  let [playTheme, { sound }] = useSound(theme);
  let [playSound] = useSound(soundToPlay, { volume: 0.75, onend: function(){soundPlayingNewState(false);}});
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
  let [soundButtonColour, setSoundButtonColour] = useState('#ff9933');
  let [soundButtonText, setSoundButtonText] = useState("Sounds OFF");
  let [soundButtonFontColour, soundButtonSetFontColour] = useState("black");
  let [gameMode, setGameMode] = useState("easy");
  let [questionsCount, setQuestionsCount] = useState(25);
  let answerInput = useRef(null);
  let [nextQuestionReady, setNextQuestionReady] = useState(true);
  let [finishIsHover, setFinishIsHover] = useState();
  let [clock, setClock] = useState("0:00");
  let [thankyouContentHiddenState, thankyouContentSetHiddenState] = useState(true)
  let [nameState, setNameState] = useState("");
  let [saveButtonNameState, setSaveButtonNameState] = useState(" SAVE ");
  let [saveButtonEnabledState, setSaveButtonEnabledState] = useState(true);
  let [saveButtonProcessingState, setSaveButtonProcessingState] = useState(false);
  let [saveButtonEnabled, saveButtonSetEnabled] = useState(false);
  let [savingTextVisible, savingTextSetVisible] = useState(true);


  // function secondsToTime(e){
  //   const h = Math.floor(e / 3600).toString().padStart(2,'0'),
  //         m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
  //         s = Math.floor(e % 60).toString().padStart(2,'0');

  //   return `${h}:`+`${m}:`+`${s}`
  //       }


  React.useEffect(() => {
    loadingTimeElapsed++;
    const checkForMusic =
      setInterval(() => {
        if (musicPlayingState == false) {
          if (sound != null) {
            sound.fade(0.0, 0.75, 2000);
            playTheme();
          }
          musicPlayingNewState(true);
        }
      }, 100);
    return () => clearInterval(checkForMusic)
  });


  React.useEffect(() => {
    secondsElapsed++;
    const timer =
      setInterval(() => setClock(
        secondsElapsed
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


  const soundButtonStyle =
  {
    paddingLeft: 10, paddingRight: 10, borderRadius: 5, marginBottom: 40, width: 180, marginLeft: 4, marginRight: 10, backgroundColor: soundButtonIsHover ? '#ff4f0e' : soundButtonColour, borderRadius: 5, border: "5px dotted", fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: soundButtonIsHover? {soundButtonFontColour} : {soundButtonFontColour},
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
              If you turn on sounds, there are some classic 'annoyed Ricky' moments from the podcasts (basically him berating Karl) which will play as a little reward if you get your question right. <br /> <br />
              You will have 25 questions to answer - there are many more questions than this so if you want to try different questions, refresh the page!<br /><br />

              If you can't work out an answer, click 'BONG!' - this will reveal it.
            </label>
          </p>
          <span>
            <label style={{ marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgreen' : 'green', width: 200, border: '4px dotted', borderColor: buttonIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { startContentHiddenNewState(true); mainContentHiddenNewState(false); secondsElapsed = 0; sound.fade(0.75, 0.0, 3000); }}>
              {" START "}
            </label>
          </span>
        </span>



        <span id="main-Content" hidden={mainContentHiddenState}> 
            <img src={rb2} className="App-background" />
          
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
          <label style={soundButtonStyle} onClick={handleSoundButtonClick} onMouseEnter={handleSoundButtonHoverIn} onMouseLeave={handleSoundButtonHoverOut}>
              {soundButtonText}
            </label>
            <input id='answerText' hidden={answerInputHidden}
              type="text" ref={answerInput} onChange={(event) => { updateAnswerState(event.target.value); }} onKeyDown={(event) => { if (event.key == 'Enter') { checkAnswer() }; }}
              style={{ marginRight: 5, alignContent: 'center', width: 520, backgroundColor: 'beige', borderRadius: 5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 28 }}>
            </input>
            <label
              style={answerTextStyle} hidden={showAnswerState} >
              {"Answer: " + "'" + a + "'"}
            </label>
            <label onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={() => { updateShowAnswerState(false); updateAnswerInputHidden(true); clueHideNewState(true); buttonHideNewState(true); }} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'tomato' : 'orangered', width: 100, border: '4px dotted', borderColor: buttonIsHover ? 'tomato' : 'orangered', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center', marginInline:5 }}>
              {" BONG "}
            </label>
            <label onClick={() => { [finalScore, finalTime] = [tallyState, secondsElapsed]; console.log([finalScore, finalTime]); mainContentHiddenNewState(true); startContentHiddenNewState(true); setEndContentHiddenState(false); }} onMouseEnter={handleFinishHoverIn} onMouseLeave={handleFinishHoverOut} hidden={buttonHideState} style={{ whiteSpace: 'pre-wrap', marginRight:20, borderRadius: 5, backgroundColor: finishIsHover ? 'lightgreen' : 'green', width: 100, border: '4px dotted', borderColor: finishIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: finishIsHover ? 'black' : 'white', alignContent: 'center' }}>
              {" FINISH "}
            </label>
            </span>
            <p>
            <span style={{marginTop:40}}>
              <label className="App-Tally"
                style={{ fontWeight: "bolder", border: "3px solid", paddingLeft: 15, paddingRight: 10, borderRadius: 5, marginRight: 2, color: 'black', fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 45, textRendering: 'optimizeLegibility', maxWidth: 100 }}>
                Score: {tallyState} / {total}
              </label>
            </span>
            </p>

        </span>
        <span id="EndContent" hidden={endContentHiddenState} style={{ border: "4px solid", width: 1200, color: 'black', paddingBottom: 50 }}>
          <label style={headerTextStyle2}>
            WELL DONE!
          </label>
          <p style={{ padding: 20 }}>
            <label hidden={saveButtonEnabled} style={welcomeTextStyle}>
              Your score is one of the top 25 scores recorded in this game. If you wish to record it for posterity, please put your name in the box below and click 'SAVE'.
            </label>
            <label hidden={savingTextVisible} style={welcomeTextStyle}>
              Saving your score...
            </label>
          </p>
          <p>
            <input id='nameText' onChange={(event) => { nameInput = event.target.value }} disabled={saveButtonEnabled}
              style={{ alignContent: 'center', width: 520, backgroundColor: 'beige', borderRadius: 5, border: "2px solid", fontWeight: 'bolder', fontSmooth: 'always', fontFamily: 'Calibri', fontSize: 28 }}>
            </input>
            <label hidden={saveButtonEnabled} style={{ marginLeft: 40, whiteSpace: 'pre-wrap', borderRadius: 5, backgroundColor: buttonIsHover ? 'lightgreen' : 'green', width: 200, border: '4px dotted', borderColor: buttonIsHover ? 'lightgreen' : 'green', marginInline: 5, fontFamily: 'Calibri', fontSmooth: 'always', fontSize: 35, fontWeight: 'bolder', color: buttonIsHover ? 'black' : 'white', alignContent: 'center' }} onMouseEnter={handleButtonHoverIn} onMouseLeave={handleButtonHoverOut} onClick={async () => { if (saveButtonProcessingState == false) {saveButtonSetEnabled(true); setSaveButtonNameState(" SAVING... "); savingTextSetVisible(false); setSaveButtonProcessingState(true); await Process([finalScore, finalTime, nameInput]);  } setEndContentHiddenState(true); thankyouContentSetHiddenState(false); }}>
              {saveButtonNameState}
            </label>
          </p>
        </span>
        <span id="ThankyouContent" hidden={thankyouContentHiddenState} style={{ border: "4px solid", width: 1200, color: 'black' }}>
          <label style={headerTextStyle2}>
            THANKYOU FOR PLAYING :)
          </label>
          <p style={{ padding: 20 }}>
            <label style={welcomeTextStyle}>
              Refresh the page if you want to play again!
            </label>
          </p>
        </span>
      </header>

    </div>

  )

  return pageLoaded;
}




export default App;


