import React, {useState, useEffect} from 'react';

import {View, StyleSheet, Text, Button, Alert, ScrollView, TouchableHighlight, useColorScheme} from 'react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../config/firebase';

const Notifications = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
 
  const currentDate = new Date();
  const [tasks, setTasks] = useState([]);
  const [dues, setDues] = useState([]);

  useEffect(() => {
    const database = ref(getDatabase(FIREBASE));
    get(child(database, 'Tasks/')).then((snapshot) => {
      if (snapshot.exists()) {
       setTasks(snapshot.val());   
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    dueTasks()
}, [tasks])



const dueTasks = async () => {
  const dues = [];
  try {
      const dueDates = await getAllDueDates(tasks);
      dueDates.forEach(due => {
      const daysDiff = getDaysDiff(due);
      if (daysDiff < 7 && daysDiff > 0) {
        dues.push(due)
      } 
    })

    setDues(dues);
  } catch(e) {
      console.log(e);
  }
}

const getDaysDiff = (due) => {
  const dueDate = new Date(formatDate(due));
  const timeDiff = dueDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}



const getAllDueDates = (data) => {
  return Object.values(data).flatMap((obj) =>
          Object.values(obj).filter((item) => item.dueDate !== undefined)
  );
}

function formatDate(dateString) {
  if(dateString) {
    const [day, month, year] = dateString.dueDate.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
}


  const styles = StyleSheet.create({

    cardTitle: {
      fontSize: 14,
      padding: 5,
      paddingHorizontal: 10,
      marginTop: -10,
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
      width: 300,
      minHeight: 70,
      backgroundColor: "#F8F8F8",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: 10,
      display: 'flex',
      flexDirection: 'row',
     
      
    },

    circle: {
      width: 15,
      height: 15,
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
      <View style={{ display: 'flex', justifyContent: 'center', paddingBottom: 100, margin: 20}}>
            {
             dues.length === 0 ? (
                <Text style={{  color: isDarkMode ? 'gray' : 'gray', textAlign: 'center', marginVertical: 100 }}>Belum Ada Notifikasi!</Text>
              ) : (
                    <View>
                        {
                            
                            dues.map((due) => {
                                      const cardBG = getCardBg(due);
                                      return (
                                        <TouchableHighlight>
                                          <>
                                            <View>
                                                <View style={styles.cardContent}>
                                                  <View  style={styles.cardTitleWrapper}>
                                                    <View style={{ ...styles.circle, backgroundColor: cardBG }}></View>
                                                  </View>
                                                  <View>
                                                    <Text style={styles.cardTitle}>
                                                          {due['taskTitle']} Mendekati Deadline!
                                                    </Text>
                                                    <Text style={{ color: isDarkMode ? 'gray' : 'gray', marginLeft: 10 }}>
                                                      H-{getDaysDiff(due)}, deadline {due.dueDate}
                                                    </Text>

                                                   
                                                  </View>

                                                </View>
                                            </View>
                                          </>
                                        </TouchableHighlight>
                                      )
                            })
                        }
                    </View>
              )
            }
          

      </View>
    </ScrollView>
  </>
  )
}



export default Notifications