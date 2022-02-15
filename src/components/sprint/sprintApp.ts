import './sprint.scss';
import { createHTMLelement } from '../../utils/utils';
import { Word, StateTextContentEn } from '../../utils/types';
import {
  checkAnswer,
  updateCurIndex,
  setWords,
  isEnd,
 // checkEnd,
 // addBusAnimation,
} from './init/init';
import { createResult } from './../result/result';
import { stateSprint } from '../../utils/constants';
//import { createPics } from './init/pictures/pictures';
import { countdown, timer1} from './init/timer/timer';
import { getWords } from '../../utils/api';
import { data } from '../../app';

export const sprint = async (
  parent:HTMLElement,
  stateTextContentEn:StateTextContentEn,
  busParent: HTMLElement,
): Promise<HTMLElement> => {
  const arrayBtnEl:HTMLElement[] = [];
  busParent.classList.add('bus');
  const sprintWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const soundBtn = createHTMLelement('div', { class: 'sound sound-on' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, sprintWrapper);
  const timerScoreWrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const timer = createHTMLelement('div', { class: 'timer' }, timerScoreWrap);
  const scoreWrap = createHTMLelement('div', { class: 'score' }, timerScoreWrap, `${stateSprint.score}`);
  const answerPicturesWrap = createHTMLelement('div', { class: 'answ-pic-wrap' }, sprintContent);
  const wordWrapEn = createHTMLelement('h2', { class: 'sprintWordEn' }, sprintContent);
  const wordWrapRu = createHTMLelement('h2', { class: 'sprintWordRu' }, sprintContent);
  const btnContainer = createHTMLelement('div', { class: 'btn-wrap' }, sprintContent);
  const btnTrue = createHTMLelement('button',
    { class: 'button button_true', 'data-answ': String(stateSprint.trueAnsw) },
    btnContainer, stateTextContentEn.btnTrue);
  arrayBtnEl.push(btnTrue);
  const btnFalse = createHTMLelement('button',
    { class: 'button button_false', 'data-answ': String(stateSprint.falseAnsw) },
    btnContainer, stateTextContentEn.btnFalse);
  arrayBtnEl.push(btnFalse);
  arrayBtnEl.forEach((el) => {
    el.addEventListener(('click'), () => {
      checkAnswer(data.words, el, scoreWrap, answerPicturesWrap);
      if (isEnd(data.words)) {
        createResult(stateSprint);
        clearTimeout(timer1);
        busParent.style.animationPlayState = 'paused';
        return;
      }
      updateCurIndex();
      setWords(data.words, wordWrapEn, wordWrapRu);
    });
  });
  setWords(data.words, wordWrapEn, wordWrapRu);
  countdown(timer);
  return sprintWrapper;
};

