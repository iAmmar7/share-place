import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
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
  const dispatch = useDispatch();

  const placeDeletedHandler = () => {
    dispatch(deletePlace(props.selectedPlace.key));

    Navigation.pop(props.componentId);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <View>
            <Text style={styles.placeName}>{props.selectedPlace.name}</Text>
          </View>
          <View style={[styles.subContainer, styles.imageContainer]}>
            <Image source={props.selectedPlace.image} style={styles.placeImage} />
          </View>
        </View>
        <View style={styles.section}>
          <View style={[styles.subContainer, styles.mapContainer]}>
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
        <View style={styles.section}>
          <View style={styles.subContainer}>
            <TouchableOpacity onPress={placeDeletedHandler}>
              <View style={styles.deleteButton}>
                <Icon
                  size={30}
                  name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                  color='orange'
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F111A',
    flex: 1,
  },
  section: {
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  subContainer: {
    width: '100%',
  },
  imageContainer: {
    height: 200,
    marginBottom: 20,
  },
  mapContainer: {
    height: 280,
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
    color: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  deleteButton: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default PlaceDetail;
