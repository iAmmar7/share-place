import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { startLoading, stopLoading, authGetToken } from './index';

export const addPlace = (placeName, location, image) => (dispatch) => {
  dispatch(startLoading());
  fetch('https://us-central1-rn-course-v2.cloudfunctions.net/storeImage', {
    method: 'POST',
    body: JSON.stringify({
      image: image.base64,
    }),
  })
    .then((res) => res.json())
    .then((parsedRes) => {
      console.log('Image stored', parsedRes);
      const placeData = {
        name: placeName,
        location,
        image: parsedRes.imageUrl,
      };
      return fetch('https://rn-course-v2.firebaseio.com/places.json', {
        method: 'POST',
        body: JSON.stringify(placeData),
      });
    })
    .catch((err) => {
      console.log(err);
      alert('Something went wrong, please try again!');
      dispatch(stopLoading());
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

export const getPlaces = () => (dispatch) => {
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
