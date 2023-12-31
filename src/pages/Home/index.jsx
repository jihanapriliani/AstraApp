import { Text, StyleSheet, View, Button, TouchableHighlight, useColorScheme, ScrollView, BackHandler, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';


import ButtonGroup from '../../components/ButtonGroup';
import Cards from '../../components/Cards';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox'

import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../../components/HomeHeader';

import AutoNotification from '../../components/AutoNotification';

const Home = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const {navigation} = props;
  const [selectedCity, setSelectedCity] = useState("C03");

  const [active, setActive] = useState("dealer");

  const [user, setUser] = useState("");

  useEffect(() => {
      const backAction = () => {
        return true; 
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => {
        backHandler.remove();
      };
  }, []);

  useEffect(() => {
   
    const fetchData = async () => {
      const data = await AsyncStorage.getItem("@user");
      if(data) {
        setUser(JSON.parse(data));
      }
    };
    fetchData();
    
  }, []);
 

  const handleGoBack = () => {};
  navigation.goBack = handleGoBack;
  
  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <AutoNotification />
    <ScrollView>
      <View style={styles.home}>

         <HomeHeader navigation={navigation} />
          
          <ButtonGroup selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
          
          <Cards navigation={navigation} selectedCity={selectedCity} />

      </View>
    </ScrollView>

      <View style={styles.navGroup}>
          <TouchableOpacity style={styles.dealerButton} onPress={() => navigation.navigate('Dealer')}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? 'black' : 'black', }}>
                <FontAwesomeIcon icon={faInbox} color='white' />
              </Text>
              <Text style={{ color: active === "dealer" ? 'white' : 'black', backgroundColor: active === "dealer" ? '#1455A3' : 'white',}}>
                Dealer
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} underlayColor={'#1455A3'} onPress={() => navigation.navigate('Profile', {'uid': user.uid})}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? 'black' : 'black', }}>
                <FontAwesomeIcon icon={faUser} color='#1455A3' />
              </Text>
              <Text style={{ color: "#1455A3", backgroundColor: "white"}}>
                  Profil
                </Text>
            </View>
          </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  home: {
    position: 'relative',
    paddingBottom: 100,
  },

  headerText: {
    fontSize: 24,
    fontWeight: '600'
    
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
    backgroundColor: 'white',
    height: '80%',
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

})

export default Home;