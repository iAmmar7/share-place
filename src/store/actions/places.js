import { SET_PLACES } from './actionTypes';
import { startLoading, stopLoading } from './index';

export const addPlace = (placeName, location, image) => {
  return (dispatch) => {
    dispatch(startLoading());
    fetch('https://us-central1-rn-course-v2.cloudfunctions.net/storeImage', {
      method: 'POST',
      body: JSON.stringify({
        image: image.base64,
      }),
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
      });
  };
};

export const getPlaces = () => (dispatch) => {
  fetch('https://rn-course-v2.firebaseio.com/places.json')
    .catch((err) => {
      console.log(err);
      alert('Something went wrong, sorry :/');
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

      dispatch(setPlaces(places));
    });
};

export const setPlaces = (places) => {
  return {
    type: 'SET_PLACES',
    places,
  };
};

export const deletePlace = (key) => {
  return {
    type: DELETE_PLACE,
    placeKey: key,
  };
};
