import React, {useEffect, useState} from 'react';

import {View, StyleSheet, Text, Button, Alert, ScrollView, TouchableHighlight, useColorScheme, BackHandler, TouchableOpacity} from 'react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../../config/firebase';


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'

const ListTasks = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const { key , dealer, dealer_id } = route.params;
  const [tasks, setTasks] = useState({});

  const [listStatus, setListStatus] = useState({})

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  
  useEffect(() => {
    const database = ref(getDatabase(FIREBASE));
    get(child(database, `Tasks/${key}`)).then((snapshot) => {
      if (snapshot.exists()) {
       setTasks(snapshot.val());
      } 
    }).catch((error) => {
      console.error(error);
    });

  }, [])

  useEffect(() => {
    getAllStatus(tasks);
  }, [tasks])

  const getAllStatus = allStatus => {
    const currentStatus = {idle:0, onprogress: 0, done: 0, drop: 0}
    const filteredStatuses = Object.keys(allStatus).filter(key => key !== "dummy" && allStatus[key]);
    const data = filteredStatuses.map(key => allStatus[key].status);
    data.forEach(status => {
      if(status === "idle") {
        currentStatus["idle"] += 1;
      }

      if(status === "onprogress") {
        currentStatus["onprogress"] += 1;
      }

      if(status === "done") {
        currentStatus["done"] += 1;
      }

      if(status === "drop") {
        currentStatus["drop"] += 1;
      }
    });
    
    setListStatus(currentStatus);
  }
  

  

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
      minHeight: 130,
      borderRadius: 20,
      backgroundColor: "#417CC2",
      display: 'flex',
      width: '90%',
      paddingTop: 15,
      // justifyContent: 'center',
      alignItems: 'center',

    },
  
    cardContent: {
      borderRadius: 10,
      width: '90%',
      minHeight: 70,
      backgroundColor: "#F8F8F8",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: 10,
      paddingVertical: 5
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
      marginVertical: 10,
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
    },

    cardTitleWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
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
    }
  });


  const getCardBg = (key) => {
   
    if(key.status === "onprogress") {
      return "#417CC2";
    } else if(key.status === "done") {
      return "#75B113";
    } else if(key.status === "idle") {
      return "#D6A600";
    } else if(key.status === "drop") {
      return "#DD2C32";
    }
  }


  


  return (
  <>
    <ScrollView>
      <View style={{ marginHorizontal: 20, marginVertical: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10}}>
                    <FontAwesomeIcon icon={faChevronLeft} color='black' />
                </Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => navigation.navigate('DownloadHistory', {dealer_id: dealer_id, dealer: dealer})}>
                <Text style={{ color: isDarkMode ? 'black' : 'black', marginRight: 10}}>
                    <FontAwesomeIcon icon={faDownload} color='black' />
                </Text>
        </TouchableOpacity>

      </View>

      <View style={{ display: 'flex', justifyContent: 'center', paddingBottom: 100, }}>
            <Text style={{  color: isDarkMode ? 'black' : 'black', marginLeft: 20, marginVertical: 20, fontSize: 24, width: '85%', fontWeight: '600' }}>{dealer}</Text>
            
            <View style={{ width: '85%', height: 5, marginHorizontal: 20, display: 'flex', 'flexDirection': 'row' }}>
                <View style={{ flex: listStatus["done"], backgroundColor: "#AED45C" }}></View>
                <View style={{ flex: listStatus["onprogress"], backgroundColor: "#417CC2" }}></View>
                <View style={{ flex: listStatus["idle"], backgroundColor: "#FDCA40" }}></View>
                <View style={{ flex: listStatus["drop"], backgroundColor: "#DD2C32" }}></View>
            </View>

            {
              Object.keys(tasks).length === 1 ? (
                <Text style={{  color: isDarkMode ? 'gray' : 'gray', textAlign: 'center', marginVertical: 100 }}>Belum Ada Data Tugas pada Dealer Ini</Text>
              ) : (
                <ScrollView style={{flexGrow: 1, marginTop: 20}}>
                    <View>
                        {
                            
                            Object.keys(tasks).map((task_key, index) => { 
                              
                                    if(task_key !== "dummy") {
                                      const cardBG = getCardBg(tasks[task_key]);
                                      return (
                                        <TouchableHighlight  activeOpacity={0.8}
                                        underlayColor={cardBG} key={task_key} style={{ ...styles.cardWrapper, backgroundColor:  cardBG}} onPress={() => navigation.navigate('DetailTask', { dealer_id: key, task_id: task_key, image_id: tasks[task_key]["uploadedImage"] })}>
                                          <>
                                            <View>
                                                <View style={styles.cardContent}>
                                                  <View  style={styles.cardTitleWrapper}>
                                                    <View style={styles.cirle}></View>
                                                    <Text style={styles.cardTitle}>
                                                          {tasks[task_key]['taskTitle']}
                                                    </Text>
                                                  </View>

                                                  <Text style={{ color: isDarkMode ? 'gray' : 'gray',  }}>
                                                    Status: {(tasks[task_key]['status']).toUpperCase()}
                                          
                                                  </Text>

                                                  <Text style={{ color: isDarkMode ? 'black' : 'black', fontSize: 12, fontStyle: 'italic', fontWeight: '500'  }}>Progress Kerja</Text>

                                                  <Text style={{ color: isDarkMode ? 'gray' : 'gray',  }}>
                                                      {tasks[task_key]['repairActivity']}
                                                  </Text>

                                                </View>
                                    
                                              
                                            </View>
                                          </>
                                        </TouchableHighlight>
                                      )
                                    }
                            })
                        }
                    </View>
                </ScrollView>
              )
            }
          

      </View>
    </ScrollView>
    <View style={styles.cityButton}>
      <TouchableHighlight activeOpacity={0.8} underlayColor="#1455A3"  onPress={() => navigation.navigate('AddTask', { dealer_id: key, dealer: dealer })}>
        <Text style={{ fontWeight: "500", color: "#fff" }}>
          + Tambah Tugas
        </Text>
      </TouchableHighlight>
    </View>
  </>
  )
}



export default ListTasks