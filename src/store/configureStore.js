import {createStore, combineReducers, compose} from 'redux';

import placesReducer from './reducers/places';

const rootReducer = combineReducers({
  places: placesReducer,
});

// Setting up redux dev tool
let composeEnhancers = compose;

if (__DEV__) {
  // Check if we are in development mode
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

// const configureStore = () => {
//   return createStore(rootReducer);
// };
const configureStore = createStore(rootReducer, composeEnhancers());

export default configureStore;
