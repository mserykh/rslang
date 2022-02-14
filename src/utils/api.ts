/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { logOut } from '../components/nav';
import { saveUserToLocalStorage } from '../services/auth/login';
import { API_ENDPOINT } from './constants';
import {
  UserWord, ResponseStatus, UserState, Word, AggregateResponse,
} from './types';

function buildGetParams(params?: { [key: string]: string | number }) {
  if (!params) {
    return '';
  }
  const queryString = Object.entries(params)
    .map((el) => `${el[0]}=${el[1]}`)
    .join('&');
  return `?${queryString}`;
}

export async function getWords(req?: { group: number, page?: number }): Promise<Word[]> {
  const result = await fetch(`${API_ENDPOINT}/words/${buildGetParams(req)}`);
  const data = await result.json();
  return data;
}

async function refreshUserToken(userState: UserState): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/users/${userState.userId}/tokens`, {
    headers: {
      Authorization: `Bearer ${userState.refreshToken}`,
    },
  });

  if (response.status !== ResponseStatus.SUCCESS) {
    // throw Error(`Failed to refresh user token. Error: '${response.text}'`);
    logOut();
  }

  const content = await response.json();
  userState.token = content.token;
  userState.refreshToken = content.refreshToken;
  saveUserToLocalStorage(userState);
}

async function fetchForUser(url: string, userState: UserState, body?: UserWord, method = 'GET') {
  let response = await fetch(url,
    {
      method,
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${userState.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  if (response.status === ResponseStatus.SUCCESS) {
    // const result = await response.json();
    return response;
  }
  if (response.status === ResponseStatus.UNAUTHORIZED) {
    await refreshUserToken(userState);
  }

  response = await fetch(url,
    {
      method,
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${userState.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  // const result = await response.json();
  return response;
}

export async function getUserWords(userState: UserState | null) {
  if (!userState) throw Error('User state is null. Cannot get user words.');
  const result = await fetchForUser(`${API_ENDPOINT}/users/${userState?.userId}/words`, userState);
  return result;
}

export async function createUserWord(userState: UserState | null, wordId: string, userWord?: UserWord) {
  if (!userState) throw Error('User state is null. Cannot create word.');
  const result = await fetchForUser(
    `${API_ENDPOINT}/users/${userState?.userId}/words/${wordId}`,
    userState,
    userWord,
    'POST',
  );
  if (!result.ok) {
    throw new Error('Cannot create word');
  }
  return result;
}

export async function updateUserWord(userState: UserState | null, wordId: string) {
  const result = await fetch(`${API_ENDPOINT}/users/${userState?.userId}/words/${wordId}`, {
    method: 'PUT',
  });
  if (!result.ok) {
    throw new Error('Cannot update word');
  }
  return result;
}

export async function getAggregatedWords(
  userState: UserState | null, req?: { group: number, page?: number, filter?: string }
) {
  if (!userState) throw Error('User state is null. Cannot get user words.');
  const url = `${API_ENDPOINT}/users/${userState.userId}/aggregatedWords${buildGetParams(req)}&wordsPerPage=20`;
  const response = await fetchForUser(url, userState);
  const result: AggregateResponse[] = await response.json();
  return result;
}

export async function getUserWordsForGame(userState: UserState | null, req?: {
  group: number,
  page?: number,
  wordsPerPage?: number,
  filter?: string,
}): Promise<[]> {
  if (!userState) throw Error('User state is null. Cannot get user words.');
  const url = `${API_ENDPOINT}/users/${userState.userId}/aggregatedWords${buildGetParams(req)}`;
  const response = await fetchForUser(url, userState);
  const result = await response.json();
  return result;
}

export async function getWord(userState: UserState | null, wordId: string) {
  if (!userState) throw Error('User state is null. Cannot get user words.');
  const url = `${API_ENDPOINT}/users/${userState.userId}/words/${wordId}`;
  const response = await fetchForUser(url, userState);
  if (response.status === ResponseStatus.SUCCESS) {
    const result = await response.json();
    console.log(result);
  }
}

export async function updateWord(userState: UserState | null, wordId: string, body: UserWord, method: string) {
  if (!userState) throw Error('User state is null. Cannot get user words.');
  const url = `${API_ENDPOINT}/users/${userState.userId}/words/${wordId}`;
  const response = await fetchForUser(url, userState, body, method);
  if (response.status === ResponseStatus.SUCCESS) {
    const result = await response.json();
    console.log(result);
  }
}
