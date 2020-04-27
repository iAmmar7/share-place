import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { startLoading, stopLoading, authGetToken } from './index';
import AsyncStorage from '@react-native-community/async-storage';

export const addPlace = (placeName, location, image) => (dispatch) => {
  let authToken;
  dispatch(startLoading());
  dispatch(authGetToken())
    .catch(() => {
      alert('No valid token found!');
    })
    .then((token) => {
      authToken = token;
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
      return fetch('https://rn-course-v2.firebaseio.com/places.json?auth=' + authToken, {
        method: 'POST',
        body: JSON.stringify(placeData),
      });
    })
    .then((res) => res.json())
    .then((parsedRes) => {
      console.log('Data stored', parsedRes);
      dispatch(stopLoading());
    })
    .catch((err) => {
      console.log(err);
      alert('Something went wrong, please try again!');
      dispatch(stopLoading());
    });
};

export const getPlaces = () => async (dispatch) => {
  let token = await AsyncStorage.getItem('sp:auth:token');
  console.log('AsyncStorage token in places.js', token);
  let expiryDate = await AsyncStorage.getItem('sp:auth:expiryDate');
  console.log('AsyncStorage expiryDate in places.js', expiryDate);

  dispatch(authGetToken())
    .then((token) => {
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
