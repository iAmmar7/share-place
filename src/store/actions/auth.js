import AsyncStorage from '@react-native-community/async-storage';

import { TRY_AUTH, AUTH_SET_TOKEN } from './actionTypes';
import { startLoading, stopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';

export const tryAuth = (authData, authMode) => (dispatch) => {
  dispatch(startLoading());
  let url =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAFclyu6KyHV389sr7-Q01p0bRT0GB9x1A';

  if (authMode === 'signup') {
    url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAFclyu6KyHV389sr7-Q01p0bRT0GB9x1A';
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email: authData.email,
      password: authData.password,
      returnSecureToken: true,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .catch((err) => {
      console.log(err);
      alert('Authentication failed, please try again!');
      dispatch(stopLoading());
    })
    .then((res) => res.json())
    .then((parsedRes) => {
      dispatch(stopLoading());
      if (!parsedRes.idToken) {
        alert('Authentication failed, please try again!');
      } else {
        dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn));
        startMainTabs();
      }
    });
};

export const authStoreToken = (token, expiresIn) => async (dispatch) => {
  dispatch(authSetToken(token));
  const now = new Date();
  const expiryDate = now.getTime() + expiresIn * 1000;
  console.log(now, new Date(expiryDate));
  try {
    await AsyncStorage.setItem('sp:auth:token', token);
    await AsyncStorage.setItem('sp:auth:expiryDate', expiryDate.toString());
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const authSetToken = (token) => {
  return {
    type: AUTH_SET_TOKEN,
    token,
  };
};

export const authGetToken = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const token = getState().auth.token;
    if (!token) {
      try {
        const tokenFromStorage = await AsyncStorage.getItem('sp:auth:token');
        if (tokenFromStorage !== null) {
          const expiryDateFromStorage = await AsyncStorage.getItem('sp:auth:expiryDate');
          const parsedExpiryDate = new Date(parseInt(expiryDateFromStorage));
          const now = new Date();

          if (expiryDateFromStorage !== null) {
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(tokenFromStorage));
              resolve(tokenFromStorage);
            } else {
              reject();
            }
          } else {
            reject();
          }
        }
      } catch (err) {
        console.log('Unable to get token from AsyncStorage', err);
        reject();
        return;
      }
    } else {
      resolve(token);
    }
  });
};

export const authAutoSignIn = () => (dispatch) => {
  dispatch(authGetToken())
    .then((token) => {
      console.log('Do I have a token?', token);
      startMainTabs();
    })
    .catch((err) => console.log('Failed to get token!'));
};
