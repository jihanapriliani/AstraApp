import React, { useEffect, useState } from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, Button, Alert, Image, ScrollView, useColorScheme} from 'react-native';

import { getDatabase, ref, get, child, remove } from "firebase/database";
import { getStorage, getDownloadURL, ref as storageRef} from 'firebase/storage';
import FIREBASE from '../../config/firebase';

const DetailTask = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { dealer_id, task_id, image_id } = route.params;
  const [ data, setData] = useState({});

  const [url, setUrl] = useState();

  

  useEffect(() => {
      const database = ref(getDatabase(FIREBASE));
      get(child(database, `Tasks/${dealer_id}/${task_id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

      const storage = getStorage(FIREBASE);
      const fileName = image_id.uri.substring(image_id.uri.lastIndexOf('/') + 1);
      const reference = storageRef(storage, `images/${fileName}`);
      getDownloadURL(reference).then(url => setUrl(url));

  }, [data, image_id])


  const handleDelButtonClicked = () => {
    Alert.alert('Info', 'Anda Yakin ingin Menghapus Data Tugas?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        const database = ref(getDatabase(FIREBASE));
        remove(child(database, `Tasks/${dealer_id}/${task_id}`)).then(() => {
          Alert.alert('Success', 'Berhasil Menghapus Data!');
          navigation.goBack();
        })

      }},
    ]);
  }
  
  const handleEditButtonClicked = () => {
    navigation.navigate('EditTask', {dealer_id: dealer_id, task_id: task_id, image_id: image_id})
  }

  const styles = StyleSheet.create({
    view: {
      color: "black",
      backgroundColor: "#fff",
      position: 'relative',
      height: '100%',
      paddingBottom: 50
    },
  
    input: {
      height: 40,
      margin: 20,
      marginBottom: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "lightgray",
      padding: 10,
      color: isDarkMode ? 'gray' : 'gray',
    },
  
    inputTextArea: {
      height: 100,
      margin: 20,
      textAlignVertical: 'top',
      marginBottom: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "lightgray",
      padding: 10,
      color: isDarkMode ? 'gray' : 'gray',
    },
  
  
    label: {
      margin: 20,
      marginBottom: -12,
      color: isDarkMode ? 'gray' : 'gray',
    },
  
    editButtonView: {
      position:'absolute',
      bottom: 10,
      right: 10
    },
  
    delButtonView: {
      position:'absolute',
      bottom: 10,
      right: 130,
    },
  
    imageBox: {
      width: 300,
      height: 200,
      marginTop: 20,
      marginLeft: 20,
    },
  
  
    
  });
  

  return (
    <ScrollView>
      <SafeAreaView style={styles.view}>
        <Text style={styles.label}>Nama Tugas</Text>
        <TextInput
          style={styles.input}
          value={data.taskTitle}
          editable={false}
        />

      <Text style={styles.label}>Status Progress</Text>
        <TextInput
          style={styles.input}
          value={data.status}
          editable={false}
      />

      <Text style={styles.label}>Aktifitas Progress Perbaikan</Text>
        <TextInput
           multiline={true}
           numberOfLines={4}
           style={styles.inputTextArea}
          value={data.repairActivity}
          editable={false}
        />

      <Text style={styles.label}>Nama PIC yang Melakukan Progress</Text>
        <TextInput
          style={styles.input}
          value={data.PICDealer}
          editable={false}
        />

      <Text style={styles.label}>Dokumentasi Progress</Text>
      <Image source={{ uri: url }} style={styles.imageBox} />
        

      <Text style={styles.label}>Tanggal Pelaksanaan Progress</Text>
        <TextInput
          style={styles.input}
          value={data.findingDate}
          editable={false}
        />

      {/* <Text style={styles.label}>Tanggal Tenggat Perbaikan</Text>
            <TextInput
              style={styles.input}
              value={data.dueDate}
              editable={false}
            /> */}
      
      <SafeAreaView  style={styles.editButtonView}>
        <Button
          onPress={handleDelButtonClicked}
          title="Delete Task"
          accessibilityLabel="Add this new task"
        />
      </SafeAreaView>

      <SafeAreaView  style={styles.delButtonView}>
        <Button
          onPress={handleEditButtonClicked}
          title="Edit Task Progress"
          accessibilityLabel="Add this new task"
        />
      </SafeAreaView>

      </SafeAreaView>
    </ScrollView>
  );
};


export default DetailTask;