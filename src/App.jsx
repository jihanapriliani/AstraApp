import React, { useEffect } from 'react'

import {NavigationContainer} from '@react-navigation/native';

import putCitiesToFirebase from './data/cities';
import putDealersToFirebase from './data/dealers'
import putUsersToFirebase from './data/users';


import Router from './router';

const App = () => {
  // console.disableYellowBox = true;
  putCitiesToFirebase();
  putDealersToFirebase();
  putUsersToFirebase();
  
  return (
    <NavigationContainer>
        <Router />
    </NavigationContainer>
  )
}

export default App