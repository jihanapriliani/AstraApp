import React, { useState } from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, Button, Alert, View, ScrollView, useColorScheme, TouchableOpacity, TouchableHighlight} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from '../../components/DatePicker';

import { getDatabase, ref, push, child, update } from "firebase/database";
import {  getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import FIREBASE from '../../config/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons/faArrowsSpin'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'



import ImageUpload from '../../components/ImageUpload';

const AddTask = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';


  const [taskTitle, setTaskTitle] = useState('');
  const [status, setstatus] = useState('');
  const [repairActivity, setRepairActivity] = useState('');
  const [PICDealer, setPICDealer] = useState('');
  
  const [findingImage, setfindingImage] = useState('');
  
  const [findingDate, setFindingDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  const [selectedStatus, setSelectedStatus] = useState("onprogress");
  const [uploadedImage, setUploadedImage] = useState([]);

  const { dealer_id, dealer } = route.params;

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  const handleAddButtonClicked = async () => {
    try {
      if(taskTitle && uploadedImage) {
          const database = getDatabase(FIREBASE);
  
          const tasks = {
            taskTitle,
            status: "idle",
            repairActivity,
            PICDealer,
            uploadedImage,
            findingDate: formatDate(findingDate),
            dueDate: formatDate(dueDate),
            httpUrlImage: findingImage
          };
    
          const historyTask = {
            taskTitle,
            status: "idle",
            repairActivity,
            PICDealer,
            uploadedImage,
            findingDate: formatDate(findingDate),
            dueDate: formatDate(dueDate),
            progressDate: "",
            httpUrlImage: findingImage,
            activityProgess: "",
            progressDate: "",
            progressImage: "",
            progressPIC: "",
          }
    
          const newTaskKey =  push(ref(database, `Tasks/${dealer_id}`)).key;
          
          update(ref(database, `Tasks/${dealer_id}/${newTaskKey}`), tasks)
            .then(data => {
              
              uploadImage()
    
              push(ref(database, `HistoryTasks/${dealer_id}/${newTaskKey}`), historyTask)
              .then((data) => {
                 Alert.alert('Success', 'Data Tugas Berhasil Ditambahkan!');
                }).catch(err => console.log(err))
                
              navigation.replace('ListTasks', { key: dealer_id, dealer: dealer});
            })
            .catch(err => console.log(err))
      } else {
        Alert.alert('Error', 'Tolong Pastikan Semua Data Terisi!');
      }
    } catch(e) {
      console.log(e);
    }

  }

  const uploadImage = () => {
    const promises = [];
    const storage = getStorage(FIREBASE);

    uploadedImage.map(async (image) => {
      const fileName = image.uri.substring(image.uri.lastIndexOf('/') + 1);
      const storageRef = refStorage(storage, 'images/' + fileName);
      
      const img = await fetch(image.uri);
      console.log(img);
      const bytes = await img.blob();
     
      const uploadTask = uploadBytesResumable(storageRef, bytes);
      promises.push(uploadTask);

      uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            console.error(error);
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log('File available at', downloadURL);
                // Do something with the downloadURL, like storing it in state or database
              })
              .catch((error) => {
                console.error('Error fetching image URL:', error);
              });
          }
        );
    })

    Promise.all(promises)
      .then(() => Alert.alert("Berhasil ditambahkan!"))
      .catch(err => console.log(err))
  }

  
  const styles = StyleSheet.create({
    view: {
      color: "black",
      backgroundColor: "#fff",
      position: 'relative',
      height: '100%',
      paddingBottom: 100
    },
  
    input: {
      height: 40,
      width: 280,
      placeholderTextColor: isDarkMode ? 'gray' : 'gray',
      marginBottom: 0,
      border: 0,
      borderBottomWidth: 1,
      borderRadius: 10,
      borderColor: "lightgray",
      padding: 10,
      color: isDarkMode ? 'gray' : 'gray',
    },
  
    inputTextArea: {
      height: 100,
      width: 280,
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
  
    labelDate: {
      margin: 20,
      marginBottom: -10,
      color: isDarkMode ? 'gray' : 'gray',
    },
  
    addButtonView: {
      position:'absolute',
      bottom: 10,
      right: 10
    },

    headerText: {
      fontSize: 24,
      fontWeight: '600',

    },


    cityButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      width: 65, 
      height: 65,
      backgroundColor: '#1455A3',
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

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
                  <Text style={{ ...styles.headerText, color: isDarkMode ? '#212121' : '#212121' }}>Tambah Tugas</Text>
                </View>

        </View>
      <ScrollView>
        <SafeAreaView style={styles.view}>
        
          {/* NAMA TEMUAN */}
        <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Nama Temuan</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setTaskTitle}
                    value={taskTitle}
                    placeholder='Tuliskan nama tugas'
                  />
              </View>
        </View>

          {/* AKTIVITAS PERBAIKAN */}
          <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faBars} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Activity Temuan</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setRepairActivity}
                    value={repairActivity}
                    placeholder='Tuliskan activity perbaikan'
                  />
              </View>
          </View>


          <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCamera} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Dokumentasi Temuan</Text>
                <ImageUpload uploadedImages={uploadedImage} setUploadedImages={setUploadedImage} />
              </View>
          </View>

          <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faUser} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Nama PIC yang Melakukan Temuan</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPICDealer}
                    value={PICDealer}
                    placeholder='Tuliskan activity perbaikan'
                  />
              </View>
          </View>


          <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCalendarDays} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Tanggal Temuan</Text>
             
              <DatePicker selectedDate={findingDate} setSelectedDate={setFindingDate} />
              </View>
          </View>

          <View style={{ maxWidth: 320, marginLeft: 20,marginTop: 15, display: 'flex', flexDirection: 'row' }}>
              <View style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, backgroundColor: '#D3D3D3', width: 25, height: 25, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCalendarDays} color='black' />
              </View>

              <View>
                <Text  style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10, fontSize: 16, fontWeight: '700'}}>Tanggal Tenggat</Text>
             
              <DatePicker selectedDate={dueDate} setSelectedDate={setDueDate} />
              </View>
          </View>
      
        </SafeAreaView>
      </ScrollView>

      <SafeAreaView  style={styles.addButtonView}>
          {/* <Button
            onPress={handleAddButtonClicked}
            title="simpan"
            accessibilityLabel="Add this new task"
          /> */}
           <View style={styles.cityButton}>
              <TouchableHighlight activeOpacity={0.8} underlayColor="#1455A3"  onPress={handleAddButtonClicked}>
                <Text style={{ fontWeight: "500", color: "#fff" }}>
                  <FontAwesomeIcon icon={faCheck} color='white' size={30} />
                </Text>
              </TouchableHighlight>
            </View>
        </SafeAreaView>

      
    </>
  );
};



export default AddTask;