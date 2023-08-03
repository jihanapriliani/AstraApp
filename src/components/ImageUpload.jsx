import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';

const ImageUpload = (props) => {
  const { uploadedImages, setUploadedImages } = props;

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Pengguna membatalkan pemilihan gambar');
      } else if (response.error) {
        console.log('Kesalahan ImagePicker: ', response.error);
      } else if (response.customButton) {
        console.log('Pengguna menekan tombol kustom: ', response.customButton);
      } else {
        const source = { uri: response.assets[0].uri };
        setUploadedImages([...uploadedImages, source]);
      }
    });
  };

  const handleUndoImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };


  console.log(uploadedImages);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{...styles.selectButton, width: uploadedImages.length > 1 ? 50 : 100,}} onPress={selectImage}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
        <ScrollView horizontal={true}>
          {uploadedImages.map((image, index) => (
            <View key={index}>
              <Image source={{ uri: image.uri }} style={styles.imageBox} />
              <TouchableOpacity
                style={styles.undoImage}
                onPress={() => handleUndoImage(index)}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 10,
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
 
    </View>
  );
};



  const styles = StyleSheet.create({
    container : {
      marginTop: 20,
      marginLeft: 50,
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: 'flex-end',
      alignItems: 'center'
    },

    selectButton: {
      borderRadius: 5,
      // width: 100,
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
      marginRight: 5,
      marginBottom: 5,
      backgroundColor: "red"
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
      right: 5,
      bottom: 5
    }
  });


export default ImageUpload;