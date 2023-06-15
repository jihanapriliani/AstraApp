import { Text, StyleSheet, View, Button, TouchableHighlight } from 'react-native'
import React, { useState } from 'react';

import ButtonGroup from '../../components/ButtonGroup';
import Cards from '../../components/Cards';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons/faMugSaucer'

const Home = (props) => {
  const {navigation} = props;
  const [selectedCity, setSelectedCity] = useState("C03");
  
  return (
    <>
      <View style={styles.home}>
        <ButtonGroup selectedCity={selectedCity} setSelectedCity={setSelectedCity} />

        
          <Cards navigation={navigation} selectedCity={selectedCity} />


       
      </View>

      <View style={styles.navGroup}>
          <TouchableHighlight style={styles.activePage}>
            <Text style={{ color: '#fff' }}>
              Dealer
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.profileButton}>
            <Text>
              Profile
            </Text>
          </TouchableHighlight>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  home: {
    position: 'relative',
  },

  cityButton : {
    display: 'flex',
    padding: 40
  },

  navGroup: {
    width: '90%',
    height: 75,
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
    right: 20,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',

    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  activePage: {
    flex: 1,
    backgroundColor: '#1455A3',
    height: '80%',
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   
  },

  profileButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

})

export default Home;