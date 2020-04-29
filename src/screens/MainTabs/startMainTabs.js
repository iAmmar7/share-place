import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
  Promise.all([
    // 1 - Details
    Icon.getImageSource(Platform.OS === 'android' ? 'md-map' : 'ios-map', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-share-alt' : 'ios-share', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-menu' : 'ios-menu', 30),
  ]).then((sources) => {
    Navigation.setRoot({
      root: {
        sideMenu: {
          left: {
            component: {
              name: 'SharePlaces.SideDrawerScreen',
            },
          },
          center: {
            bottomTabs: {
              children: [
                {
                  stack: {
                    children: [
                      {
                        component: {
                          name: 'SharePlaces.FindPlaceScreen',
                          passProps: {
                            text: 'This is tab 1',
                          },
                        },
                      },
                    ],
                    options: {
                      bottomTab: {
                        text: 'Find Place',
                        icon: sources[0],
                        // icon: require('../images/one.png'),
                        testID: 'FIRST_TAB_BAR_BUTTON',
                        selectedIconColor: 'orange',
                        selectedTextColor: 'orange',
                      },
                      topBar: {
                        leftButtonColor: 'orange',
                        title: {
                          text: 'Find Place',
                          alignment: 'center',
                          color: 'orange',
                        },
                        background: {
                          color: '#0F111A',
                          translucent: false,
                        },
                        leftButtons: [
                          {
                            id: 'leftDrawerToggle',
                            icon: sources[2],
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  stack: {
                    children: [
                      {
                        component: {
                          name: 'SharePlaces.SharePlaceScreen',
                          passProps: {
                            text: 'This is tab 2',
                          },
                        },
                      },
                    ],
                    options: {
                      bottomTab: {
                        text: 'Share Place',
                        icon: sources[1],
                        // icon: require('../images/two.png'),
                        testID: 'SECOND_TAB_BAR_BUTTON',
                        selectedIconColor: 'orange',
                        backgroundColor: '#0F111A',
                      },
                      topBar: {
                        leftButtonColor: 'orange',
                        title: {
                          text: 'Share Place',
                          alignment: 'center',
                          color: 'orange',
                        },
                        background: {
                          color: '#0F111A',
                          translucent: false,
                        },
                        leftButtons: [
                          {
                            id: 'leftDrawerToggle',
                            icon: sources[2],
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });
  });
};

export default startTabs;

// 1- Details:
// In previous version, we can not render tabs without Icons in Android.
// So we need icon, for that we can simply use require(../path/img.png).
// But in previous we can't really use require here.
// So we need react-native-vector-icons but we can not use it here like normally we use in react-native.
// Here we use Icon.getImageSource() function but it returns a promise, before it we can't use it in our tab. We need to wait for it, and then use it in out tab, that is why we have used Promise here.
