import { Text, StyleSheet, View, Button, TouchableHighlight, useColorScheme, ScrollView, BackHandler, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';


import ButtonGroup from '../../components/ButtonGroup';
import Cards from '../../components/Cards';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons/faCalendarDays'



import AsyncStorage from '@react-native-async-storage/async-storage';



const Home = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const refNavigation = useNavigation();

  const {navigation} = props;
  const [selectedCity, setSelectedCity] = useState("C03");

  const [active, setActive] = useState("dealer");

  const [user, setUser] = useState();

    useEffect(() => {
      const backAction = () => {
        // Tidak melakukan apa-apa
        return true; // Menyatakan bahwa penanganan tombol kembali sudah ditangani
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => {
        // Menghapus listener saat komponen di-unmount
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

  const handleGoBack = () => {
    // Tidak melakukan apa-apa
  };

  // Mengganti perilaku navigation.goBack() dengan fungsi kosong
  navigation.goBack = handleGoBack;
  
  return (
    <>
    <ScrollView>
      <View style={styles.home}>

          <View style={{ marginHorizontal: 20, marginVertical: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style={{ ...styles.headerText, color: isDarkMode ? '#212121' : '#212121' }}>Dealer</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row'}}>

            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={{ color: isDarkMode ? '' : '',marginRight: 30 }}>
                <FontAwesomeIcon icon={faBell} size={20} />
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity>
              <Text style={{ color: isDarkMode ? '' : '', }}>
                <FontAwesomeIcon icon={faCalendarDays} size={20} />
              </Text>
            </TouchableOpacity> */}

            </View>
          </View>
          
         

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
    </>
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