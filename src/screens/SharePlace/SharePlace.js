import React, { Component } from 'react';
import { View, Button, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { addPlace } from '../../store/actions/index';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import validate from '../../utility/validation';

class SharePlaceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controls: {
        placeName: {
          value: '',
          valid: false,
          touched: false,
          validationRules: {
            notEmpty: true,
          },
        },
        location: {
          value: null,
          valid: false,
        },
        image: {
          value: null,
          valid: false,
        },
      },
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

  imagePickedHandler = (image) => {
    this.setState((prevState) => {
      return {
        controls: {
          ...prevState.controls,
          image: {
            value: image,
            valid: true,
          },
        },
      };
    });
  };

  locationPickedHandler = (location) => {
    this.setState((prevState) => {
      return {
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true,
          },
        },
      };
    });
  };

  placeNameChangedHandler = (val) => {
    this.setState((prevState) => {
      return {
        controls: {
          ...prevState.controls,
          placeName: {
            ...prevState.controls.placeName,
            value: val,
            valid: validate(val, prevState.controls.placeName.validationRules),
            touched: true,
          },
        },
      };
    });
  };

  placeAddedHandler = () => {
    this.props.addPlace(
      this.state.controls.placeName.value,
      this.state.controls.location.value,
      this.state.controls.image.value,
    );
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share a place with us!</HeadingText>
          </MainText>
          <PickImage onImagePicked={this.imagePickedHandler} />
          <PickLocation onLocationPick={this.locationPickedHandler} />
          <PlaceInput
            placeData={this.state.controls.placeName}
            onChangeText={this.placeNameChangedHandler}
          />
          <View style={styles.button}>
            {this.props.isLoading ? (
              <ActivityIndicator size='large' color='orange' />
            ) : (
              <Button
                title='Share the Place!'
                onPress={this.placeAddedHandler}
                disabled={
                  !this.state.controls.placeName.valid ||
                  !this.state.controls.location.valid ||
                  !this.state.controls.image.valid
                }
              />
            )}
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

const mapStateToProps = (state) => ({
  isLoading: state.ui.isLoading,
});

export default connect(mapStateToProps, { addPlace })(SharePlaceScreen);
