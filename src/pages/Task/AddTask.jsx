import React, { useState } from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, Button, Alert} from 'react-native';

import { getDatabase, ref, push, child } from "firebase/database";
import FIREBASE from '../../config/firebase';

const AddTask = ({route, navigation}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [findings, setFindings] = useState('');
  const [repairActivity, setRepairActivity] = useState('');
  const [dealerLoc, setDealerLoc] = useState('');
  const [findingLoc, setFindingLoc] = useState('');
  const [PICDealer, setPICDealer] = useState('');

  const { dealer_id, dealer } = route.params;

  const handleAddButtonClicked = () => {
    if(taskTitle && findings && repairActivity && dealerLoc && findingLoc && PICDealer) {
        const database = getDatabase(FIREBASE);


        const tasks = {
          taskTitle,
          findings,
          repairActivity,
          dealerLoc,
          findingLoc,
          PICDealer
        };

        push(ref(database, `Tasks/${dealer_id}`), tasks)
          .then(data => {
            Alert.alert('Success', 'Data Tugas Berhasil Ditambahkan!');
            navigation.replace('ListTasks', { key: dealer_id, dealer: dealer});
          })
          .catch(err => console.log(err))

    } else {
      Alert.alert('Error', 'Tolong Pastikan Semua Data Terisi!');
    }
  }


  return (
    <SafeAreaView style={styles.view}>
      <Text style={styles.label}>Nama Tugas</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTaskTitle}
        value={taskTitle}
        placeholder='Tuliskan nama tugas'
      />

    <Text style={styles.label}>Temuan</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFindings}
        value={findings}
        placeholder='Tuliskan temuan yang perlu diperbaiki'
    />

    <Text style={styles.label}>Aktifitas Perbaikan</Text>
      <TextInput
        style={styles.input}
        onChangeText={setRepairActivity}
        value={repairActivity}
        placeholder='Tuliskan aktifitas perbaikan'
      />

    <Text style={styles.label}>Dealer</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDealerLoc}
        value={dealerLoc}
        placeholder='Tuliskan aktifitas perbaikan'
      />

    <Text style={styles.label}>Lokasi Temuan</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFindingLoc}
        value={findingLoc}
        placeholder='Tuliskan lokasi temuan'
      />

    <Text style={styles.label}>PIC Dealer</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPICDealer}
        value={PICDealer}
        placeholder='Tuliskan lokasi temuan'
      />
    
    <SafeAreaView  style={styles.addButtonView}>
      <Button
        onPress={handleAddButtonClicked}
        title="Add Task"
        accessibilityLabel="Add this new task"
      />
    </SafeAreaView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    color: "black",
    backgroundColor: "#fff",
    position: 'relative',
    height: '100%'
  },

  input: {
    height: 40,
    margin: 20,
    marginBottom: 0,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "lightgray",
    padding: 10,
  },

  label: {
    margin: 20,
    marginBottom: -12
  },

  addButtonView: {
    position:'absolute',
    bottom: 10,
    right: 10
  }
  
});

export default AddTask;