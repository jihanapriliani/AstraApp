import { View, Text, useColorScheme, StyleSheet, TouchableHighlight, Platform, PermissionsAndroid, Alert, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react';

import DatePicker from 'react-native-date-picker';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'

import { getDatabase, ref, get, child, remove } from "firebase/database";
import FIREBASE from '../../config/firebase';


// var RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';



const ExportDealerHistory = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [fDate, setfDate] = useState(new Date());
  const [lDate, setLDate] = useState(new Date());

  const {dealer_id, dealer} = route.params;
  const [data, setData] = useState({});

  useEffect(() => {
    const database = ref(getDatabase(FIREBASE));
    get(child(database, `HistoryTasks/${dealer_id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
}, [data, dealer_id, fDate, lDate])





const getSpesificData = (data) => {
  const startDate = fDate;
  const endDate = lDate;
  
  const tasksInRange = data.filter(task => {
    const dateParts = task.dueDate.split("-");
    const dueDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    return dueDate >= startDate && dueDate <= endDate;
  });
  
  
  return tasksInRange;
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


const convertDataID = (data) => {
  const convertedData = data.map((item, index) => {
    const {
      PICDealer,
      activityProgess,
      dueDate,
      findingDate,
      progressDate,
      progressImage,
      uploadedImage,
      repairActivity,
      status,
      taskTitle,
      progressPIC,
    } = item;

    return {
      "No": index + 1,
      "Nama Temuan": taskTitle,
      "Activity Temuan": repairActivity,
      "Dealer": dealer,
      "Dokumentasi Temuan": uploadedImage,
      "Tanggal Temuan": findingDate,
      "Tanggal Tenggat Temuan": dueDate,
      "PIC yang Melakukan Temuan": PICDealer,
      "Activity Progress Perbaikan": activityProgess,
      "Dokumentasi Perbaikan": progressImage,
      "Tanggal Progress Perbaikan": progressDate,
      "PIC Yang Melakukan Pengecekan Perbaikan": progressPIC,
      "Status": status
    };
  });

  return convertedData;
};

const convertToDataArray = () => {
  const dataArray = [];

  for (const taskId in data) {
      for (const subTaskId in data[taskId]) {
          const task = {
              idTask: taskId,
              subTaskId: subTaskId,
              ...data[taskId][subTaskId]
          };

          // Mengambil nilai dari key 'uri' pada progressImage
          if (task.progressImage) {
              const progressImageUrls = task.progressImage.uri;
              task.progressImage = progressImageUrls;
          }

          // Mengambil nilai dari key 'uri' pada uploadedImage
          if (task.uploadedImage) {
              const uploadedImageUrls = task.uploadedImage.uri;
              task.uploadedImage = uploadedImageUrls;
          }

          delete task.httpUrlImage;
          delete task.subTaskId;
          delete task.taskId;
          
          dataArray.push(task);
      }
  }

  return dataArray;
}



const exportDataToExcel = () => {
    const dateTime = getCurrentDateTime();
    let wb = XLSX.utils.book_new();

    const convertedData = convertToDataArray(data);
    const formattedData = convertDataID(convertedData);

    let ws = XLSX.utils.json_to_sheet(formattedData)    
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
           console.log("Harusnya nge export");
           await exportDataToExcel();
        }
      }catch(e){
        console.log('Error while checking permission');
        console.log(e);
        return
      }

    }
    
  };

 

  const handleDwPress = () => {
    console.log("Tanggal awal", (fDate));
    console.log("Tanggal akhir", lDate);
    console.log("DATA", data);
    if(data) {
      try {
        const spesificData = getSpesificData(convertToDataArray(data));
        setData(spesificData)
      } catch(e) {
        Alert.alert('Gagal', 'Data tidak ada, belum ditemukan data history tugas pada rentang tersebut!');
      }
    }
    handleClick();
  }


  return (
    <View style={{ backgroundColor: "white", height: '100%' }}>
      <View style={{ marginHorizontal: 20, marginVertical: 15, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10}}>
                    <FontAwesomeIcon icon={faChevronLeft} color='black' />
                </Text>
        </TouchableOpacity>
        <View>
              <Text style={{ ...styles.headerText, color: isDarkMode ? '#212121' : '#212121' }}>Mengunduh</Text>
        </View>

      </View>

      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ width: '85%' }}>
          <Text style={{  color: isDarkMode ? '#808080' : '#808080', fontSize: 16, marginVertical: 20 }}>Pilih tanggal tugas yang ingin diunduh dalam satu excel</Text>

          <View style={{  width: '85%', marginVertical: 20 }}>
            <Text style={{  color: isDarkMode ? 'dimgray' : 'dimgray', fontSize: 16, marginBottom: 10 }}>Tanggal Awal</Text>
            <DatePicker date={fDate} onDateChange={setfDate} textColor='gray' mode='date'/>
          </View>

          <View style={{  width: '85%' }}>
            <Text style={{  color: isDarkMode ? 'dimgray' : 'dimgray', fontSize: 16, marginBottom: 10 }}>Tanggal Akhir</Text>
            <DatePicker date={lDate} onDateChange={setLDate} textColor='gray' mode='date'/>
          </View>
        </View>
      </View>

      <View style={styles.cityButton}>
      <TouchableHighlight activeOpacity={0.8} underlayColor="#1455A3" onPress={handleDwPress}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faArrowDown} color='white' />
          <Text style={{ fontWeight: "500", color: "#fff", marginLeft: 5 }}>
            Unduh
          </Text>
        </View>
      </TouchableHighlight>
   
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
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

  headerText: {
    fontSize: 24,
    fontWeight: '600'
  },
});

export default ExportDealerHistory