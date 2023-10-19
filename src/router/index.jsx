import React, { useEffect } from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Home from '../pages/Home';

import ListTasks from '../pages/Task/ListTasks';
import AddTask from '../pages/Task/AddTask';
import DetailTask from '../pages/Task/DetailTask';
import EditTask from '../pages/Task/EditTask';
import Login from '../pages/Login';
import Profile from '../pages/Home/Profile';
import ChangePassword from '../pages/ChangePassword';
import ExportDealerHistory from '../pages/Dealer/ExportDealerHistory';
import Notifications from '../pages/Notifications';

const Router = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
    >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false, title: "Log in" }} 
          />
          
          <Stack.Screen
              name="Dealer"
              component={Home}
              options={{
                headerBackTitleVisible: false,
                headerBackVisible: false,
                headerShown: false
              }}
          
          />
          
          <Stack.Screen
              name="Profile"
              component={Profile}
              options={{headerShown: false}}
          />
          <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{headerShown: true}}
          />
           <Stack.Screen 
            name='ListTasks'
            component={ListTasks}
            options={{headerShown: false}}
          />

          <Stack.Screen 
            name='DetailTask'
            component={DetailTask}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTask}
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name='EditTask'
            component={EditTask}
            options={{headerShown: false}}
          />

          <Stack.Screen 
            name='DownloadHistory'
            component={ExportDealerHistory}
            options={{headerShown: false}}
          />

          <Stack.Screen 
            name='Notifications'
            component={Notifications}
            options={{headerShown: false}}
          />

    </Stack.Navigator>
  )
}

export default Router