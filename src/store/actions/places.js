import { ADD_PLACE, DELETE_PLACE } from './actionTypes';

export const addPlace = (placeName, location, image) => {
  return (dispatch) => {
    fetch('https://us-central1-rn-course-v2.cloudfunctions.net/storeImage', {
      method: 'POST',
      body: JSON.stringify({
        image: image.base64,
      }),
    })
      .catch((err) => console.log(err))
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
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((parsedRes) => {
        console.log('Data stored', parsedRes);
      });
  };
};

export const deletePlace = (key) => {
  return {
    type: DELETE_PLACE,
    placeKey: key,
  };
};
