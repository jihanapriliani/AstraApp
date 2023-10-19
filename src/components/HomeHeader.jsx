import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../config/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'

const HomeHeader = ({navigation}) => {
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

  return (
    <View style={{ marginHorizontal: 20, marginVertical: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style={{ ...styles.headerText, color: isDarkMode ? '#212121' : '#212121' }}>Dealer</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row'}}>

            <TouchableOpacity style={{ position:'relative' }} onPress={() => navigation.navigate('Notifications')}>
                <Text style={{ color: isDarkMode ? '' : '',marginRight: 10 }}>
                    <FontAwesomeIcon icon={faBell} size={30} />
                </Text>
                <Text style={styles.notifCount}>
                    {dues.length}
                </Text>
            </TouchableOpacity>

            </View>
    </View>
  )
}

const styles = StyleSheet.create({

    headerText: {
      fontSize: 24,
      fontWeight: '600'
    },

    notifCount: {
        borderRadius: 20,
        paddingLeft: 6,
        width: 20,
        height: 20,
        fontSize: 12,
        color: 'white',
        fontWeight: '800',
        backgroundColor: "red",

        position: 'absolute',
        top: 2,
        right: 3,
    }

})
  

export default HomeHeader