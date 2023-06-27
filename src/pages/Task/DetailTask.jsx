import React, { useEffect, useState } from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, Button, Alert, Image, ScrollView, useColorScheme, View, TouchableOpacity, TouchableHighlight} from 'react-native';

import { getDatabase, ref, get, child, remove } from "firebase/database";
import { getStorage, getDownloadURL, ref as storageRef} from 'firebase/storage';
import FIREBASE from '../../config/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons/faArrowsSpin'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'


const DetailTask = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { dealer_id, task_id, image_id } = route.params;
  const [ data, setData] = useState({});
  const [historyTask, setHistoryTask] = useState({});

  const [url, setUrl] = useState();
  const [findingURL, setFindingURL] = useState("loading.gif");

  

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

     
      try {
        const storage = getStorage(FIREBASE);
        const fileName = image_id.uri.substring(image_id.uri.lastIndexOf('/') + 1);
        const reference = storageRef(storage, `images/${fileName}`);
        getDownloadURL(reference).then(url => setUrl(url));
      } catch(e) {
        console.log(e);
      }
  }, [data, image_id])



  useEffect(() => {
    const database = ref(getDatabase(FIREBASE));
    get(child(database, `HistoryTasks/${dealer_id}/${task_id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const tasks = snapshot.val();
        const keys = Object.keys(tasks);
        const firstKey = keys[0];
        setHistoryTask(tasks[firstKey]);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    

   try {
     const storage = getStorage(FIREBASE);
     const fileName = historyTask.uploadedImage.uri.substring(historyTask.uploadedImage.uri.lastIndexOf('/') + 1);
     const reference = storageRef(storage, `images/${fileName}`);
     getDownloadURL(reference).then(url => setFindingURL(url));
   } catch(e) {
    console.log(e);
   }

  }, [historyTask])


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
      width: 250,
      height: 200,
      marginTop: 5,
      borderRadius: 20
    },
  
    headerText: {
      fontSize: 24,
      fontWeight: '600',

    },

    cityButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: '#1455A3',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,

      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 5,
    },

    delButton: {
      position: 'absolute',
      bottom: 10,
      right: 160,
      backgroundColor: '#DD2C32',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,

      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 5,
    }
  
    
  });
  

  return (
    <>
       <View style={{ paddingHorizontal: 20, paddingVertical: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10}}>
                    <FontAwesomeIcon icon={faChevronLeft} color='black' />
                </Text>
        </TouchableOpacity>
                <View>
                  <Text style={{ ...styles.headerText, color: isDarkMode ? '#212121' : '#212121' }}>{data.taskTitle}</Text>
                </View>

        </View>
    <ScrollView>

      <SafeAreaView style={styles.view}>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faArrowsSpin} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Status</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, textTransform: 'uppercase', fontWeight: '300'}}>{data.status}</Text>
              </View>
        </View>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faBars} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Activity Temuan</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '300'}}>{historyTask.repairActivity}</Text>
              </View>
        </View>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCamera} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Dokumentasi Temuan</Text>
                <Image source={{ uri: url }} style={styles.imageBox} />
               
              </View>
        </View>


        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faUser} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Nama PIC yang Melakukan Temuan</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '300'}}>{data.PICDealer}</Text>
              </View>
        </View>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faGear} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Activity Progress</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '300'}}>{data.repairActivity}</Text>
              </View>
        </View>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCamera} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Dokumentasi Progress</Text>
                <Image source={{ uri: findingURL }} style={styles.imageBox} />
               
              </View>
        </View>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCalendarDays} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Tanggal Temuan</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '300'}}>{historyTask.findingDate}</Text>
              </View>
        </View>
        

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCalendarDays} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Tanggal Tenggat</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '300'}}>{data.dueDate}</Text>
              </View>
        </View>

        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCalendarDays} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Tanggal Progress</Text>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '300'}}>{data.findingDate}</Text>
              </View>
        </View>

     

     
      </SafeAreaView>
    </ScrollView>

      <View style={styles.cityButton}>
        <TouchableHighlight activeOpacity={0.8} underlayColor="#1455A3"  onPress={handleEditButtonClicked}>
          <View style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <FontAwesomeIcon icon={faPencil} color='white' />
            <Text style={{ fontWeight: "500", color: "#fff", marginLeft: 5 }}>
              Edit Progress
            </Text>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.delButton}>
        <TouchableHighlight activeOpacity={0.8} underlayColor="#1455A3"  onPress={handleDelButtonClicked}>
          <View style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <FontAwesomeIcon icon={faTrashCan} color='white' />
          </View>
        </TouchableHighlight>
      </View>
    </>
  );
};


export default DetailTask;