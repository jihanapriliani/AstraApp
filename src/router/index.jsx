import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Home from '../pages/Home';

import ListTasks from '../pages/Task/ListTasks';
import AddTask from '../pages/Task/AddTask';
import DetailTask from '../pages/Task/DetailTask';
import EditTask from '../pages/Task/EditTask';
import Login from '../pages/Login';
import Profile from '../pages/Home/Profile';

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
              options={{headerShown: true}}
          />
          <Stack.Screen
              name="Profile"
              component={Profile}
              options={{headerShown: true}}
          />
           <Stack.Screen 
            name='ListTasks'
            component={ListTasks}
            options={{headerShown: true}}
          />

          <Stack.Screen 
            name='DetailTask'
            component={DetailTask}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTask}
            options={{headerShown: true}}
          />
          <Stack.Screen 
            name='EditTask'
            component={EditTask}
            options={{headerShown: true}}
          />

    </Stack.Navigator>
  )
}

export default Router