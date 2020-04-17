import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";

import Icon from "react-native-vector-icons/Ionicons";
import { deletePlace } from "../../store/actions/index";

const PlaceDetail = (props) => {
  const placeDeletedHandler = () => {
    props.onDeletePlace(props.selectedPlace.key);

    Navigation.pop(props.componentId);
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={props.selectedPlace.image} style={styles.itemImage} />
        <Text style={styles.itemText}>{props.selectedPlace.name}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={placeDeletedHandler}>
          <View style={styles.deleteButton}>
            <Icon
              size={30}
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              color="red"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 22,
  },
  itemImage: {
    width: "100%",
    height: 200,
  },
  itemText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28,
  },
  deleteButton: {
    alignItems: "center",
  },
});

const mapDispatchToProps = (dispatch) => ({
  onDeletePlace: (key) => dispatch(deletePlace(key)),
});

export default connect(null, mapDispatchToProps)(PlaceDetail);
