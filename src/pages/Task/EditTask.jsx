import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, Button, Alert, View, ScrollView, useColorScheme} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from '../../components/DatePicker';

import { getDatabase, ref, push, child, set, get, update} from "firebase/database";
import {  getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import FIREBASE from '../../config/firebase';


import ImageUpload from '../../components/ImageUpload';

const AddTask = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [taskTitle, setTaskTitle] = useState();
  const [repairActivity, setRepairActivity] = useState();
  const [PICDealer, setPICDealer] = useState();
  
  const [findingImage, setfindingImage] = useState('');
  
  const [findingDate, setFindingDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  const [selectedStatus, setSelectedStatus] = useState();
  const [uploadedImage, setUploadedImage] = useState(null);

  const [ data, setData ] = useState({});
  const [ url, setUrl ] = useState("")
  
  const { dealer_id, task_id, image_id } = route.params;

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

        setTaskTitle(data.taskTitle);
        setRepairActivity(data.repairActivity);
        setPICDealer(data.PICDealer);
        setSelectedStatus(data.status);   
        
        
        const storage = getStorage(FIREBASE);
        const fileName = image_id.uri.substring(image_id.uri.lastIndexOf('/') + 1);
        const reference = storageRef(storage, `images/${fileName}`);
        getDownloadURL(reference).then(url => setUrl(url));

        setUploadedImage({uri: url});
    }, [])


 function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleEditButtonClicked = () => {
    if(taskTitle) {
      // && status && repairActivity && uploadedImage != null && PICDealer && findingDate != {} && dueDate != {}
        const database = getDatabase(FIREBASE);


        const tasks = {
          taskTitle,
          status: selectedStatus,
          repairActivity,
          PICDealer,
          uploadedImage,
          findingDate: formatDate(findingDate),
          dueDate: formatDate(dueDate),
          httpUrlImage: findingImage
        };

        update(ref(database, `Tasks/${dealer_id}/${task_id}`), tasks)
          .then(data => {
            Alert.alert('Success', 'Data Tugas Berhasil Diubah!');
            
            uploadImage();

            navigation.goBack();
          })
          .catch(err => console.log(err))

    } else {
      Alert.alert('Error', 'Tolong Pastikan Semua Data Terisi!');
    }
  }

  

  const uploadImage = async () => {
    try {
      const storage = getStorage(FIREBASE);
      const fileName = uploadedImage.uri.substring(uploadedImage.uri.lastIndexOf('/') + 1);
      const storageRef = storageRef(storage, 'images/' + fileName);

      //convert image to array of bytes
      const img = await fetch(uploadedImage.uri);
      const bytes = await img.blob(); 
      
      const uploadTask = uploadBytesResumable(storageRef, bytes);
      
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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setfindingImage(downloadURL);
            console.log('File available at', downloadURL);
          });
        }
      );
    } catch(e) {
      console.error(e);
    }
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
  
    labelDate: {
      margin: 20,
      marginBottom: -10,
      color: isDarkMode ? 'gray' : 'gray',
    },
  
    addButtonView: {
      position:'absolute',
      bottom: 10,
      right: 10
    }
    
  });


  return (
    <ScrollView>
      <SafeAreaView style={styles.view}>
        <Text style={styles.label}>Nama Temuan</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTaskTitle}
          value={taskTitle}
          placeholder='Tuliskan nama tugas'
        />

      <Text style={styles.label}>Status</Text>
          <Picker
              selectedValue={selectedStatus}
              style={{ height: 50, width: 250, marginLeft: 10, color: isDarkMode ? 'gray' : 'gray', backgroundColor: isDarkMode ? 'lightgray' : 'lightgray', marginTop: 20, marginLeft: 20, borderRadius: 20 }}
              onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)}
          >
            <Picker.Item label="On Progress" value="onprogress"/>
            <Picker.Item label="Done" value="done" />
            <Picker.Item label="Idle" value="idle" />
            <Picker.Item label="Drop" value="drop" />
          </Picker>

      
      <Text style={styles.label}>Aktifitas Perbaikan</Text>
        <TextInput
          multiline={true}
          numberOfLines={4}
          style={styles.inputTextArea}
          onChangeText={setRepairActivity}
          value={repairActivity}
          placeholder='Tuliskan aktifitas perbaikan'
        />

      <Text style={styles.label}>Nama PIC yang Menemukan</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPICDealer}
          value={PICDealer}
          placeholder='Tuliskan lokasi temuan'
        />

      <Text style={styles.label}>Dokumentasi Temuan</Text>
      <ImageUpload uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />
      

      <Text style={styles.labelDate}>Tanggal Temuan</Text>
      <DatePicker selectedDate={findingDate} setSelectedDate={setFindingDate} />

      <Text style={styles.labelDate}>Tanggal Temuan</Text>
      <DatePicker selectedDate={dueDate} setSelectedDate={setDueDate} />

      <SafeAreaView  style={styles.addButtonView}>
        <Button
          onPress={handleEditButtonClicked}
          title="Perbarui Tugas"
          accessibilityLabel="Add this new task"
        />
      </SafeAreaView>


      </SafeAreaView>
    </ScrollView>
  );
};



export default AddTask;