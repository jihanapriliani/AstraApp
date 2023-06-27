import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import notifee, { AndroidColor } from '@notifee/react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../config/firebase';


const NotificationScreen = () => {
  useEffect(() => {
    const notificationTimer = startNotificationTimer();

    return () => {
      BackgroundTimer.clearInterval(notificationTimer);
    };
  }, []);

  const currentDate = new Date();
  const [tasks, setTasks] = useState([]);

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
  }, [])

  const handleNotificatin = async () => {
      try {
          const dueDates = await getAllDueDates(tasks);
          dueDates.forEach(due => {
          const dueDate = new Date(formatDate(due));
          const timeDiff = dueDate.getTime() - currentDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          if (daysDiff < 7 && daysDiff > 0) {
              console.log(due);            
          } 
        })
      } catch(e) {
          console.log(e);
      }
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

  const startNotificationTimer = (title, body) => {
    const notificationTimer = BackgroundTimer.setInterval(() => {
      showNotification(title, body);
    }, 60000); 

    // Set background event handler for Notifee
    notifee.onBackgroundEvent(async () => {
      try {
        const dueDates = await getAllDueDates(tasks);
        dueDates.forEach(due => {
        const dueDate = new Date(formatDate(due));
        const timeDiff = dueDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (daysDiff < 7 && daysDiff > 0) {
            onDisplayNotification(due.taskTitle, due.dueDate);            
        } 
      })
    } catch(e) {
        console.log(e);
    }
    });

    return notificationTimer;
  };

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

  return (
    <View>
      <Button title="Start Notification Timer" onPress={handleNotificatin} />
    </View>
  );
};

export default NotificationScreen;
