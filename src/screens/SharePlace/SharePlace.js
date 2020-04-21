import React, { Component } from 'react';
import { View, Button, StyleSheet, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { addPlace } from '../../store/actions/index';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
// import PickImage from "../../components/PickImage/PickImage";
import PickLocation from '../../components/PickLocation/PickLocation';

class SharePlaceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controls: {
        placeName: {
          value: "",
          valid: false,
          touched: false,
          validationRules: {
            notEmpty: true
          }
        },
        location: {
          value: null,
          valid: false
        }
      }
    };
    Navigation.events().bindComponent(this);
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

    locationPickedHandler = location => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true
          }
        }
      };
    });
  };

  placeAddedHandler = () => {
    if (this.state.placeName.trim() !== '') {
      this.props.onAddPlace(this.state.placeName);
    }
  };

  placeNameChangedHandler = (val) => {
    this.setState({
      placeName: val,
    });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share a place with us!</HeadingText>
          </MainText>
          {/* <PickImage /> */}
          <PickLocation onLocationPick={this.locationPickedHandler} />
          <PlaceInput
            placeName={this.state.placeName}
            onChangeText={this.placeNameChangedHandler}
          />
          <View style={styles.button}>
            <Button title='Share the Place!' onPress={this.placeAddedHandler} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  palceholder: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '80%',
    height: 150,
  },
  button: {
    margin: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPlace: (placeName) => dispatch(addPlace(placeName)),
  };
};

export default connect(null, mapDispatchToProps)(SharePlaceScreen);
