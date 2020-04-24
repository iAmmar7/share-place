import React, { useState } from 'react';
import { View, Image, Button, StyleSheet, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-picker';

function PickImage(props) {
  const [pickedImage, setPickedImage] = useState(null);

  const pickImageHandler = () => {
    const options = {
      title: 'Pick an Image',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (res) => {
      if (res.didCancel) {
        console.log('User cancelled!');
      } else if (res.error) {
        console.log('Error', res.error);
      } else {
        setPickedImage({ uri: res.uri });
        props.onImagePicked({ uri: res.uri, base64: res.data });
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Image source={pickedImage} style={styles.previewImage} />
      </View>
      <View style={styles.button}>
        <Button title='Pick Image' onPress={pickImageHandler} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  placeholder: {
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

export default PickImage;
