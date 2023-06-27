import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';




const ImageUpload = (props) => {
    const {uploadedImage, setUploadedImage} = props;
    
    const selectImage = () => {
      const options = {
        maxWidth: 2000,
        maxHeight: 2000,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
      
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.assets[0].uri };
          setUploadedImage(source);
        }
      });
    };



    const handleUndoImage = () => {
        setUploadedImage(null);
    }

    return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {uploadedImage !== null ? (
              <View>
                <Image source={{ uri: uploadedImage.uri }} style={styles.imageBox} />
                <TouchableOpacity style={styles.undoImage} onPress={handleUndoImage}>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 10 }}>X</Text>
                </TouchableOpacity>
              </View>    
            ) : (
              null
            )}
          </View>
        </SafeAreaView>
      );
};


  const styles = StyleSheet.create({
    container : {
      marginTop: 20,
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: 'flex-end',
      alignItems: 'center'
    },

    selectButton: {
      borderRadius: 5,
      width: 100,
      height: 100,
      backgroundColor: '#D3D3D3',
      alignItems: 'center',
      justifyContent: 'center'
    },
    uploadButton: {
      borderRadius: 5,
      width: 150,
      height: 50,
      backgroundColor: '#ffb6b9',
      alignItems: 'center',
      justifyContent: 'center',
      // marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold'
    },
    imageContainer: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative'
    },
    progressBarContainer: {
      // marginTop: 20
    },
    imageBox: {
      width: 100,
      height: 100,
      marginRight: 5
    },

    undoImage: {
      width: 20,
      height: 20,
      backgroundColor: 'red',
      textAlign: 'center',
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      bottom: -5
    }
  });


export default ImageUpload;