import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { Navigation } from 'react-native-navigation';

import Icon from 'react-native-vector-icons/Ionicons';
import { deletePlace } from '../../store/actions/index';

function PlaceDetail(props) {
  const [viewMode, setViewMode] = useState('portrait');
  const dispatch = useDispatch();

  useEffect(() => {
    Dimensions.addEventListener('change', updateStyles);

    return () => {
      Dimensions.removeEventListener('change', updateStyles);
    };
  }, [viewMode]);

  const updateStyles = (dims) => {
    setViewMode(dims.window.height > 500 ? 'portrait' : 'landscape');
  };

  const placeDeletedHandler = () => {
    dispatch(deletePlace(props.selectedPlace.key));

    Navigation.pop(props.componentId);
  };

  return (
    <View
      style={[
        styles.container,
        viewMode === 'portrait' ? styles.portraitContainer : styles.landscapeContainer,
      ]}>
      <View style={styles.placeDetailContainer}>
        <View style={styles.subContainer}>
          <Image source={props.selectedPlace.image} style={styles.placeImage} />
        </View>
        <View style={styles.subContainer}>
          <MapView
            initialRegion={{
              ...props.selectedPlace.location,
              latitudeDelta: 0.0122,
              longitudeDelta:
                (Dimensions.get('window').width / Dimensions.get('window').height) * 0.0122,
            }}
            style={styles.map}>
            <MapView.Marker coordinate={props.selectedPlace.location} />
          </MapView>
        </View>
      </View>
      <View style={styles.subContainer}>
        <View>
          <Text style={styles.placeName}>{props.selectedPlace.name}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={placeDeletedHandler}>
            <View style={styles.deleteButton}>
              <Icon
                size={30}
                name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                color='red'
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1,
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  placeDetailContainer: {
    flex: 2,
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  deleteButton: {
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
  },
});

export default PlaceDetail;
