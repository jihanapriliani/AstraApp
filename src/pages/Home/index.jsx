import { Text, StyleSheet, View, Button, TouchableHighlight, useColorScheme, ScrollView } from 'react-native'
import React, { useState } from 'react';

import ButtonGroup from '../../components/ButtonGroup';
import Cards from '../../components/Cards';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons/faBoxArchive'

import {useAuth} from '../../hooks/useAuth';


const Home = (props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {navigation} = props;
  const [selectedCity, setSelectedCity] = useState("C03");

  const [active, setActive] = useState("dealer");

  const { user } = useAuth(); 
  
  return (
    <>
    <ScrollView>
      <View style={styles.home}>
          <ButtonGroup selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
          
          <Cards navigation={navigation} selectedCity={selectedCity} />

      </View>
    </ScrollView>

      <View style={styles.navGroup}>
          <TouchableHighlight style={styles.dealerButton} onPress={() => navigation.navigate('Dealer')}>
            <Text style={{ color: active === "dealer" ? 'white' : 'black', backgroundColor: active === "dealer" ? '#1455A3' : 'white',}}>
              Dealer
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.profileButton} onPress={() => navigation.navigate('Profile', {'uid': user.uid})}>
            <Text style={{ color: isDarkMode ? 'black' : 'black', }}>
              <FontAwesomeIcon icon={faUser} color='#1455A3' />
            </Text>
          </TouchableHighlight>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  home: {
    position: 'relative',
    paddingBottom: 100,
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

  dealerButton: {
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