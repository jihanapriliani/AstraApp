import React, {useState} from 'react';

import {View, StyleSheet, Text, Button, Alert} from 'react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../../config/firebase';


const ListTasks = ({route, navigation}) => {
  const { key, dealer } = route.params;

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
            <Text>Data Tugas pada Dealer Ini</Text>
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

})

export default ListTasks