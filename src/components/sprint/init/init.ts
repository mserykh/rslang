import { Word } from '../../../utils/types';
import { stateSprint } from '../../../utils/constants';
import { createResult } from '../../result/result';

const createScore = (scoreWrap:HTMLElement) => {
  scoreWrap.textContent = '';
  stateSprint.score += 30;
  scoreWrap.textContent = `${stateSprint.score}`;
};

const checkCountCorrectAnswers = (data:Word[], scoreWrap:HTMLElement) => {
  if (data[stateSprint.curIndex].correctAnswer === 1) {
    stateSprint.countCorrectAnsw++;
    if (stateSprint.countCorrectAnsw === 3) {
      createScore(scoreWrap);
      stateSprint.countCorrectAnsw = 0;
    }
  } else if (data[stateSprint.curIndex].correctAnswer === 0) {
    stateSprint.countCorrectAnsw = 0;
  }
};

const checkAnswer = (data: Word[], btn: HTMLElement, scoreWrap: HTMLElement):void => {
  const k = Number(btn.dataset.answ);
  if (k === stateSprint.randomTrueFalse) {
    data[stateSprint.curIndex].correctAnswer = 1;
  } else {
    data[stateSprint.curIndex].correctAnswer = 0;
  }
  checkCountCorrectAnswers(data, scoreWrap);
  stateSprint.questionsArray.push(data[stateSprint.curIndex]);
};

const updateCurIndex = () => {
  stateSprint.curIndex += 1;
};

const getTrueFalseRandom = ():number => Math.floor(Math.random() * 2);

const createRandomAnswerFalse = (data: Word[], currentIndex: number): number => {
  const getRandomTranslateWord = ():number => Math.floor(Math.random() * data.length);
  let k = getRandomTranslateWord();
  while (k === currentIndex) {
    k = getRandomTranslateWord();
  }
  return k;
};

const setWordRu = (data: Word[], wordRu: HTMLElement, currentIndex:number) => {
  stateSprint.randomTrueFalse = getTrueFalseRandom();
  if (stateSprint.randomTrueFalse === stateSprint.falseAnsw) {
    wordRu.textContent = data[createRandomAnswerFalse(data, stateSprint.curIndex)].wordTranslate;
  } else {
    wordRu.textContent = data[currentIndex].wordTranslate;
  }
};

const setWordEn = (data: Word[], wordEn: HTMLElement) => {
  wordEn.textContent = '';
  wordEn.textContent = data[stateSprint.curIndex].word;
};

const setWords = (data: Word[], wordEn: HTMLElement, wordRu:HTMLElement) => {
  setWordEn(data, wordEn);
  setWordRu(data, wordRu, stateSprint.curIndex);
};

const checkEnd = ():void => {
  if (stateSprint.max_sec === -1) {
    createResult(stateSprint);
  }
};

export const addBusAnimation = (busParent:HTMLElement) => {
  busParent.classList.add('animate');
};

const removeBusAnimation = (busParent:HTMLElement) => {
  busParent.classList.remove('animate');
};

export {
  checkAnswer,
  updateCurIndex,
  setWords,
  checkEnd,
};
