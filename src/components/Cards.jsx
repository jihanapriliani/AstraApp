var RNFS = require('react-native-fs');
import XLSX from 'xlsx'


import {StyleSheet, View, TouchableHighlight, Text, ScrollView, Alert, useColorScheme, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';

import {getDatabase, ref, get, child} from 'firebase/database';
import FIREBASE from '../config/firebase';

const Cards = props => {
  const isDarkMode = useColorScheme() === 'dark';

  // const workbook = XLSX.utils.book_new();
  // const worksheet = XLSX.utils.json_to_sheet(dataArray);


  const { selectedCity, navigation } = props;
  const [dealers, setDealers] = useState({});


  useEffect(() => {
    const database = getDatabase(FIREBASE);
    const dataRef = ref(database);
    get(child(dataRef, 'Dealers'))
      .then(snapshot => {
        if (snapshot.exists()) {
          setDealers(snapshot.val()[selectedCity]);
        } else {
          console.log('No data available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [selectedCity]);

  const styles = StyleSheet.create({

    cardTitle: {
      fontSize: 16,
      padding: 5,
      fontWeight: '700',
      width: 250,
      color: isDarkMode ? 'black' : 'black',
    },
  
    cardWrapper: {
      marginHorizontal: 20,
      marginVertical: 10,
      height: 130,
      borderRadius: 20,
      backgroundColor: "#417CC2",
      display: 'flex',
      paddingTop: 15,
      // justifyContent: 'center',
      alignItems: 'center'
    },
  
    cardContent: {
      borderRadius: 10,
      width: 280,
      height: 70,
      backgroundColor: "#F8F8F8",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10
      // justifyContent: 'center'
    },

    cirle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#D9D9D9"
    },

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
  });

  // const exportDataToExcel = (key) => {
  //   let dealerHistory = {};
  //   const worksheetData = Object.keys(dealerHistory).map((key, index) => {
  //     return {
  //       'Nama Temuan': dealerHistory[key].taskTitle,
  //       'Aktivitas Temuan': dealerHistory[key].repairActivity,
  //       'Dealer': dealerHistory[key].dealer,
  //       'Dokumentasi Temuan': dealerHistory[key].findingDate,
  //       'Tanggal Tenggat Perbaikan': dealerHistory[key].dueDate,
  //       'PIC yang Melakukan Temuan': dealerHistory[key].PICDealer,
  //       'Aktivitas Progress Perbaikan': dealerHistory[key].activityProgress,
  //       'Dokumentasi Perbaikan': dealerHistory[key].progressImage,
  //       'Tanggal Progress Perbaikan': dealerHistory[key].progressDate,
  //       'PIC Yang Melakukan Pengecekan Perbaikan': dealerHistory[key].progressPIC,
  //       'Status': dealerHistory[key].status,
  //     };
  //   });
    

  //   // Membuat workbook baru
  //   const workbook = XLSX.utils.book_new();

  //   // Membuat worksheet baru
  //   const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  //   // Menambahkan worksheet ke workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  //   const wbout = XLSX.write(workbook, {type:'binary', bookType:"xlsx"});

  //   RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/my_exported_file.xlsx').then((r) => {
  //     console.log('Berhasil dibuat');
  //   }).catch((e) => {
  //     console.log('Error', e);
  //   })

  //   // Write generated excel to Storage
  //   RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/my_exported_file.xlsx', wbout, 'ascii').then((r)=>{
  //     console.log('Success');
  //   }).catch((e)=>{
  //     console.log('Error', e);
  //   });

  // }

  // const handlePrintDealer = async (key) => {
  //   try {
  //      // Check for Permission (check if permission is already given or not)
  //      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

  //      if(!isPermitedExternalStorage){
 
  //        // Ask for permission
  //        const granted = await PermissionsAndroid.request(
  //          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //          {
  //            title: "Storage permission needed",
  //            buttonNeutral: "Ask Me Later",
  //            buttonNegative: "Cancel",
  //            buttonPositive: "OK"
  //          }
  //        );
 
         
  //        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //          // Permission Granted (calling our exportDataToExcel function)
  //          exportDataToExcel();
  //          console.log("Permission granted");
  //        } else {
  //          // Permission denied
  //          console.log("Permission denied");
  //        }
  //      } else {
  //         // Already have Permission (calling our exportDataToExcel function)
  //         const database = getDatabase(FIREBASE);
  //         const dataRef = ref(database);
    

  //         get(child(dataRef, `HistoryTasks/${key}`))
  //           .then(snapshot => {
  //             if (snapshot.exists()) {
                
  //               exportDataToExcel(key);

  //             } else {
  //               console.log('No data available');
  //             }
  //           })
  //           .catch(error => {
  //             console.error(error);
  //           });
  //           }
  //   } catch(e) {
  //     console.log('Error while checking permission');
  //     console.log(e);
  //     return
  //   }

    
  // }

  
  
  return( 
      <ScrollView style={{flexGrow: 1}}>
        <View>
            {
                
                Object.keys(dealers).map((key, index) =>   (
                    <View  key={key} style={styles.cardWrapper}>
                        <View>
                            <TouchableHighlight style={styles.cardContent} activeOpacity={0.8}
                    underlayColor="white"  onPress={() => navigation.navigate('ListTasks', { key: key, dealer: dealers[key] })}>
                              <>
                                <View style={styles.cirle}></View>
                                  <Text style={styles.cardTitle}>
                                      {dealers[key]}
                                  </Text>
                              </>
                            </TouchableHighlight>
                
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {/* <Text style={{ marginLeft: 5, marginTop: 10 }}>Nama Ketua Dealer {index + 1}</Text> */}

                                <TouchableHighlight style={styles.dotContainer}  onPress={() => handlePrintDealer(key)}>
                                  <Text style={styles.dot}>
                                    ...
                                  </Text>

                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                ))
            }
        </View>
    </ScrollView>
  );
};



export default Cards;
