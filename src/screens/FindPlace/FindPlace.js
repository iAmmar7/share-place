import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from '../../store/actions/index';

class FindPlaceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placesLoaded: false,
      removeAnim: new Animated.Value(1),
      placesAnim: new Animated.Value(0),
    };

    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    this.props.getPlaces();
  }

  navigationButtonPressed(event) {
    if (event.buttonId === 'leftDrawerToggle') {
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

  itemSelectedHandler = (key) => {
    const selPlace = this.props.places.find((place) => place.key === key);

    Navigation.push(this.props.componentId, {
      component: {
        name: 'SharePlaces.PlaceDetailScreen',
        passProps: {
          selectedPlace: selPlace,
        },
        options: {
          topBar: {
            title: {
              text: 'Place Detail',
            },
            leftButtons: [],
          },
        },
      },
    });
  };

  placesLoadedHandler = () => {
    Animated.timing(this.state.placesAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Animation function
  placesSearchHandler = () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ placesLoaded: true });
      this.placesLoadedHandler();
    });
  };

  render() {
    const { placesLoaded, removeAnim, placesAnim } = this.state;

    let content = (
      <Animated.View
        style={{
          opacity: removeAnim,
          transform: [
            {
              scale: removeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 1],
              }),
            },
          ],
        }}>
        <TouchableOpacity onPress={this.placesSearchHandler}>
          <View style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Find Places</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );

    if (placesLoaded) {
      content = (
        <Animated.View
          style={{
            opacity: placesAnim,
          }}>
          <PlaceList places={this.props.places} onItemSelected={this.itemSelectedHandler} />
        </Animated.View>
      );
    }
    return <View style={placesLoaded ? null : styles.buttonContainer}>{content}</View>;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    borderColor: 'orange',
    borderWidth: 3,
    borderRadius: 50,
    padding: 20,
  },
  searchButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 26,
  },
});

const mapStateToProps = (state) => {
  return {
    places: state.places.places,
  };
};

export default connect(mapStateToProps, { getPlaces })(FindPlaceScreen);
