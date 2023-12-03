import { qS } from './questions.js';
import { useState } from 'react';

function indexRandomNumber() {
    var indexRandom = Math.floor(Math.random() * 165);
    return indexRandom;
}

export function GetQuestionAndAnswer() {
    var questionsAndAnswers = qS.split(/\r?\n/);
    var questionsAndAnswersSeparated = [];
    for (var x = 0; x < questionsAndAnswers.length; x++) {

        var f = questionsAndAnswers[x]
        questionsAndAnswersSeparated.push(f);
    }

    let shuffledArray = questionsAndAnswersSeparated
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)


    shuffledArray.length = 25;
    return shuffledArray;
}

