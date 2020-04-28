import AsyncStorage from '@react-native-community/async-storage';
import { Navigation } from 'react-native-navigation';

import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { startLoading, stopLoading, authGetToken } from './index';

export const addPlace = (placeName, location, image, componentId) => (dispatch) => {
  let authToken;
  dispatch(startLoading());
  dispatch(authGetToken())
    .catch(() => {
      alert('No valid token found!');
    })
    .then((token) => {
      authToken = token;

      // Firebase Cloud Function for image store - created by me
      return fetch('https://us-central1-rn-course-v2.cloudfunctions.net/storeImage', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
        body: JSON.stringify({
          image: image.base64,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      alert('Something went wrong, please try again!');
      dispatch(stopLoading());
    })
    .then((res) => res.json())
    .then((parsedRes) => {
      console.log('Image stored', parsedRes);
      const placeData = {
        name: placeName,
        location,
        image: parsedRes.imageUrl,
      };

      // Firebase post API for places
      return fetch('https://rn-course-v2.firebaseio.com/places.json?auth=' + authToken, {
        method: 'POST',
        body: JSON.stringify(placeData),
      });
    })
    .then((res) => res.json())
    .then((parsedRes) => {
      console.log('Data stored', parsedRes);
      dispatch(stopLoading());
      Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabIndex: 0,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      alert('Something went wrong, please try again!');
      dispatch(stopLoading());
    });
};

export const getPlaces = () => async (dispatch) => {
  let token = await AsyncStorage.getItem('sp:auth:token');
  let expiryDate = await AsyncStorage.getItem('sp:auth:expiryDate');
  let refreshToken = await AsyncStorage.getItem('sp:auth:refreshToken');
  console.log('AsyncStorage token in places.js', token);
  console.log('AsyncStorage expiryDate in places.js', expiryDate);
  console.log('AsyncStorage refreshToken in places.js', refreshToken);

  dispatch(authGetToken())
    .then((token) => {
      // Firebase get API for places
      return fetch('https://rn-course-v2.firebaseio.com/places.json?auth=' + token);
    })
    .catch(() => {
      alert('No valid token found!');
    })
    .then((res) => res.json())
    .then((parsedRes) => {
      const places = [];
      for (let key in parsedRes) {
        places.push({
          ...parsedRes[key],
          image: {
            uri: parsedRes[key].image,
          },
          key,
        });
      }
      if (parsedRes.error) {
        alert(parsedRes.error);
      }
      dispatch(setPlaces(places));
    })
    .catch((err) => {
      console.log(err);
      alert('Something went wrong, sorry :/');
    });
};

export const setPlaces = (places) => {
  return {
    type: SET_PLACES,
    places,
  };
};

export const deletePlace = (key) => (dispatch) => {
  dispatch(authGetToken())
    .catch(() => {
      alert('No valid token found!');
    })
    .then((token) => {
      dispatch(removePlace(key));

      // Firebase delete API for places
      return fetch('https://rn-course-v2.firebaseio.com/places/' + key + '.json?auth=' + token, {
        method: 'DELETE',
      });
    })
    .then((res) => res.json())
    .then((parsedRes) => {
      console.log('Deleted successfully!');
    })
    .catch((err) => {
      alert('Something went wrong, sorry :/');
      console.log(err);
    });
};

export const removePlace = (key) => {
  return {
    type: REMOVE_PLACE,
    key: key,
  };
};
