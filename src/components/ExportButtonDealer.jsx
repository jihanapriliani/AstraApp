import { View, Text, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import { getDatabase, ref, get, child, remove } from "firebase/database";
import FIREBASE from '../config/firebase';

// var RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

const ExportButtonDealer = (props) => {

  const {dealer} = props;
  const [data, setData] = useState({});

  useEffect(() => {
    const database = ref(getDatabase(FIREBASE));
    console.log("dealer", dealer);
    get(child(database, `HistoryTasks/${dealer}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
}, [])


 const convertToDataArray = () => {
    const dataArray = [];

    for (const taskId in data) {
        for (const subTaskId in data[taskId]) {
            const task = {
            idTask: taskId,
            subTaskId: subTaskId,
            ...data[taskId][subTaskId]
            };
            dataArray.push(task);
        }
    }
    return(dataArray)
 }


  const getCurrentDateTime = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
    const currentDateTime = `${year}-${month}-${day}--${hours}-${minutes}-${seconds}`;
  
    return currentDateTime;
  };
  
  // function to handle exporting
  const exportDataToExcel = () => {
    const dateTime = getCurrentDateTime();
    console.log(typeof(dateTime));

    // Created Sample data
    let sample_data_to_export = [{id: '1', name: 'First User'},{ id: '2', name: 'Second User'}];
    console.log("data dealer  " + data);

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(convertToDataArray(data))    
    XLSX.utils.book_append_sheet(wb,ws,"Users")
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});

    RNFS.mkdir(RNFS.ExternalDirectoryPath).then((r) => {
        
        const sourceFilePath = RNFS.ExternalDirectoryPath + `/report-${dateTime}.xlsx`;
        const destinationFilePath = RNFS.DownloadDirectoryPath + `/report-${dateTime}.xlsx`;

        // Write generated excel to Storage
        RNFS.writeFile(sourceFilePath, wbout, 'ascii').then((r)=>{
          RNFS.moveFile(sourceFilePath, destinationFilePath)
          .then(() => {
            Alert.alert('Success', `File report-${dateTime}.xlsx Berhasil Disimpan di dalam Folder Download!`)
          })
          .catch((error) => {
            console.log('Error moving file:', error);
          });
        }).catch((e)=>{
            Alert.alert('Gagal', 'Gagal Menyimpan File!');
        });
    }).catch((e) => {
        console.log('Error', e);
    })

    


  }
  const handleClick = async () => {
    console.log(Platform.constants['Release']);
    if(Platform.OS === 'android' && Platform.constants['Release'] >= 13) {
      exportDataToExcel();
    } else {
      try{
        // Check for Permission (check if permission is already given or not)
        let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  
        if(!isPermitedExternalStorage){
  
          // Ask for permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage permission needed",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
  
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission Granted (calling our exportDataToExcel function)
            await exportDataToExcel();
            console.log("Permission granted");
          } else {
            // Permission denied
            console.log("Permission denied");
          }
        }else{
           // Already have Permission (calling our exportDataToExcel function)
           console.log("Harusnya nge expot");
           await exportDataToExcel();
        }
      }catch(e){
        console.log('Error while checking permission');
        console.log(e);
        return
      }

    }
    
  };

  const styles = {
    dotContainer: {
        height: 20,
        width: 30,
        backgroundColor: 'white',
        marginRight: 5,
        marginTop: 10,
        fontSize: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      },
  
      dot : {
        fontSize: 20,
        lineHeight: 15,
        color: '#417CC2',
        fontWeight: 'bold',
      }
  };

  return (
   <>
        <TouchableOpacity style={styles.dotContainer} onPress={() => handleClick()}>
            <Text style={styles.dot}>
                ...
            </Text>
        </TouchableOpacity>
    </>
  );
}

export default ExportButtonDealer