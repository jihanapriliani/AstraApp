import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';

import notifee from '@notifee/react-native';

import { getDatabase, ref, child, get } from "firebase/database";
import FIREBASE from '../config/firebase';

const useNotification = () => {

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

    const handleClick = async () => {

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

    async function onDisplayNotification(title, body) {
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: title,
          body: body,
          android: {
            channelId,
            smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
      }
    
    return handleClick;
}

export default Notification