import './game.scss';
import {
  getElement,
  createHTMLelement,
  createElement,
  renderElement,
  isFullscreenOpen,
} from '../../utils/utils';
import { createAudio, muteSound } from './sound/sound';
import { sprint } from '../../components/sprint/sprintApp';
import { StateTextContentEn } from '../../utils/types';
import { fullscreen } from './full-screen/full-screen';
import { audioChallenge } from '../../components/audio-game/audio-game';
import { getDictionaryPage } from '../../components/result/result';

export const viewGame = (game: string, stateTextContentEn: StateTextContentEn):HTMLElement => {
  const parent = getElement('div');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper' }, gameSection);
  const gameClose = createElement(
    'a',
    { class: 'btn btn--close btn--game-close', href: `/dictionary/${getDictionaryPage()}` },
  );
  gameClose.addEventListener('click', () => window.history.back());
  renderElement(gameClose, gameWrapper);

  const fullScreen = createHTMLelement(
    'div',
    { class: `full-screen ${isFullscreenOpen() ? 'screen-close' : 'screen-open'} ` },
    gameWrapper,
  );
  fullScreen.addEventListener('click', () => {
    fullscreen(gameSection, fullScreen);
  });

  const soundBtn = createHTMLelement('div', { class: 'sound sound-on' }, gameWrapper);
  createAudio(soundBtn);
  soundBtn.addEventListener('click', () => {
    muteSound();
  });

  const gameContent = createHTMLelement('div', { class: 'game-wrapper-content' }, gameWrapper);
  if (game === 'sprint') {
    sprint(gameContent, stateTextContentEn, gameWrapper);
  }
  if (game === 'audioChallenge') {
    audioChallenge(gameContent);
  }
  function changeIcon(button: HTMLElement) {
    if (!document.fullscreenElement) {
      if (button.classList.contains('screen-close')) {
        button.classList.remove('screen-close');
        button.classList.add('screen-open');
      }
      button.classList.remove('screen-close');
      button.classList.add('screen-open');
    }
  }

  window.addEventListener('fullscreenchange', () => changeIcon(fullScreen));
  return gameSection;
};
