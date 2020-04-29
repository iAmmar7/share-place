import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Dimensions allow us to dynamically find out the dimension of the running device
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const SideDrawer = (props) => {
  const logOutHandler = () => {
    Navigation.mergeOptions(props.componentId, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logOutHandler}>
        <View style={styles.drawerItem}>
          <Icon
            name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
            size={30}
            color='#aaa'
            style={styles.drawerItemIcon}
          />
          <Text>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#0F111A',
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  drawerItemIcon: {
    marginRight: 10,
  },
});

export default SideDrawer;
