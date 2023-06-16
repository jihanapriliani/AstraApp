import React, {useState} from 'react';

import {View, StyleSheet, Text, Button, Alert, ScrollView, TouchableHighlight} from 'react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../../config/firebase';


const ListTasks = ({route, navigation}) => {
  const { key , dealer } = route.params;

  const [tasks, setTasks] = useState("");

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

  


  return (
  
   <View>
        <Text>{dealer}</Text>
        {
          Object.keys(tasks).length === 1 ? (
            <Text>Belum Ada Data Tugas pada Dealer Ini</Text>
          ) : (
            <ScrollView style={{flexGrow: 1}}>
                <View>
                    {
                        
                        Object.keys(tasks).map((task_key, index) => { 
                          
                                if(task_key !== "dummy") {
                                  return (
                                    <TouchableHighlight key={task_key} style={styles.cardWrapper} onPress={() => navigation.navigate('DetailTask', { dealer_id: key, task_id: task_key, image_id: tasks[task_key]["uploadedImage"] })}>
                                        <View>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardTitle}>
                                                    {tasks[task_key]['taskTitle']}
                                                </Text>
                                            </View>
                                
                                            <View>
                                                <Text>Nama Ketua Dealer {index + 1}</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                  )
                                }
                         })
                    }
                </View>
            </ScrollView>
          )
        }
       
         <View style={styles.cityButton}>
          <Button
            title="Add Task"
            onPress={() => navigation.navigate('AddTask', { dealer_id: key, dealer: dealer })}
          />
        </View>

   </View>
  )
}

const styles = StyleSheet.create({
  cityButton : {
    display: 'flex',
    padding: 40
  },


  cardTitle: {
    fontSize: 16,
    padding: 5
  },

  cardWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 150,
    borderRadius: 20,
    backgroundColor: "#417CC2",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardContent: {
    borderRadius: 10,
    width: '80%',
    height: '50%',
    backgroundColor: "#F8F8F8"
  }

})

export default ListTasks