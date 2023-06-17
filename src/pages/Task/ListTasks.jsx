import React, {useState} from 'react';

import {View, StyleSheet, Text, Button, Alert, ScrollView, TouchableHighlight, useColorScheme} from 'react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../../config/firebase';


const ListTasks = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const { key , dealer } = route.params;

  const [tasks, setTasks] = useState({});

  const database = ref(getDatabase(FIREBASE));
  get(child(database, `Tasks/${key}`)).then((snapshot) => {
    if (snapshot.exists()) {
     setTasks(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

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
      paddingTop: 15,
      // justifyContent: 'center',
      alignItems: 'center',

    },
  
    cardContent: {
      borderRadius: 10,
      width: 280,
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
      <View style={{ display: 'flex', justifyContent: 'center', }}>
            <Text style={{  color: isDarkMode ? 'black' : 'black', marginLeft: 20, marginVertical: 20, fontSize: 24, width: '85%', fontWeight: '600' }}>{dealer}</Text>
            
            <View style={{ width: '85%', height: 5, marginHorizontal: 20, display: 'flex', 'flexDirection': 'row' }}>
                <View style={{ flex: 1, backgroundColor: "#AED45C" }}></View>
                <View style={{ flex: 1, backgroundColor: "#417CC2" }}></View>
                <View style={{ flex: 1, backgroundColor: "#FDCA40" }}></View>
                <View style={{ flex: 1, backgroundColor: "#DD2C32" }}></View>
            </View>

            {
              Object.keys(tasks).length === 1 ? (
                <Text style={{  color: isDarkMode ? 'gray' : 'gray', textAlign: 'center', marginVertical: 100 }}>Belum Ada Data Tugas pada Dealer Ini</Text>
              ) : (
                <ScrollView style={{flexGrow: 1}}>
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
                                    
                                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={styles.dotContainer}>
                                                      <Text style={styles.dot}>
                                                        ...
                                                      </Text>
                    
                                                    </View>
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