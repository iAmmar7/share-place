import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/Auth';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import FindPlaceScreen from './src/screens/FindPlace/FindPlace';
import PlaceDetailScreen from './src/screens/PlaceDetail/PlaceDetail';
import SideDrawerScreen from './src/screens/SideDrawer/SideDrawer';
import configureStore from './src/store/configureStore';

// Register Screen
Navigation.registerComponent(
  'SharePlaces.AuthScreen',
  () => (props) => (
    <Provider store={configureStore}>
      <AuthScreen {...props} />
    </Provider>
  ),
  () => AuthScreen,
);
Navigation.registerComponent(
  'SharePlaces.SharePlaceScreen',
  () => (props) => (
    <Provider store={configureStore}>
      <SharePlaceScreen {...props} />
    </Provider>
  ),
  () => SharePlaceScreen,
);
Navigation.registerComponent(
  'SharePlaces.FindPlaceScreen',
  () => (props) => (
    <Provider store={configureStore}>
      <FindPlaceScreen {...props} />
    </Provider>
  ),
  () => FindPlaceScreen,
);
Navigation.registerComponent(
  'SharePlaces.PlaceDetailScreen',
  () => (props) => (
    <Provider store={configureStore}>
      <PlaceDetailScreen {...props} />
    </Provider>
  ),
  () => PlaceDetailScreen,
);
Navigation.registerComponent('SharePlaces.SideDrawerScreen', () => SideDrawerScreen);

// Start an App
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'SharePlaces.AuthScreen',
              text: 'Login',
            },
          },
        ],
        options: {
          topBar: {
            visible: false,
            title: {
              text: 'Login',
              alignment: 'center',
              borderColor: 'red',
            },
          },
        },
      },
    },
  });
});
