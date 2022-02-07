export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
  correctAnswer: number | undefined | null;
}

export interface StateSprint {
  curIndex:number;
  score:number;
  countCorrectAnsw:number;
  questionsArray: Word[];
  falseAnsw:number;
  trueAnsw:number;
  randomTrueFalse:number | null;
}

export interface StateTextContentEn {
  btnTrue: string,
  btnFalse: string,
  exit: string
}

export interface IData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}
