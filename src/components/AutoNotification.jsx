import React, { useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import notifee, { AndroidColor } from '@notifee/react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../config/firebase';

const NotificationScreen = () => {
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


  useEffect(() => {
    dues.forEach(due => {
      showNotification(due.taskTitle + " Mendekati Deadline!", getDaysDiff(due) + " hari lagi menuju tenggat penyelesaian.");
    })
  }, []);

  const showNotification = async (title, body) => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        color: AndroidColor.RED,
      },
    });
  };

  const handleAppStateChange = (appState) => {
    if (appState === 'background' || appState === 'inactive') {
      startBackgroundNotification();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    notifee.onBackgroundEvent(async () => {
      dues.forEach(due => {
        showNotification(due.taskTitle + " Mendekati Deadline!", getDaysDiff(due) + " hari lagi menuju tenggat penyelesaian.");
      });
    });
  }, []);

  const startBackgroundNotification = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      dues.forEach(due => {
        showNotification(due.taskTitle + " Mendekati Deadline!", getDaysDiff(due) + " hari lagi menuju tenggat penyelesaian.");
      });
    }, 100000000); // Set interval to 10 seconds
  };

  return (
    <View>
      {/* Content of your component */}
    </View>
  );
};

export default NotificationScreen;