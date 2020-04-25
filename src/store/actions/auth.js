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
        dispatch(authSetToken(parsedRes.idToken));
        startMainTabs();
      }
    });
};

export const authSetToken = (token) => {
  return {
    type: AUTH_SET_TOKEN,
    token,
  };
};

export const authGetToken = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const token = getState().auth.token;
    if (!token) {
      reject();
    } else {
      resolve(token);
    }
  });
};
