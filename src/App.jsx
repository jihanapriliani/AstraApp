import React, { useEffect } from 'react'

import {NavigationContainer} from '@react-navigation/native';

import putCitiesToFirebase from './data/cities';
import putDealersToFirebase from './data/dealers'


import Router from './router';

const App = () => {
  putCitiesToFirebase();
  putDealersToFirebase();
  
  return (
    <NavigationContainer>
        <Router />
    </NavigationContainer>
  )
}

export default App