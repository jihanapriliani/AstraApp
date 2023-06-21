import { View, Text, StyleSheet, TouchableHighlight, useColorScheme } from 'react-native'
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faRightFromBracket }  from '@fortawesome/free-solid-svg-icons/faRightFromBracket'

const Profile = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [active, setActive] = useState("profile");

  return (
    <>
         <View style={{ display: 'flex', justifyContent: 'center', }}>
        <Text style={{  color: isDarkMode ? 'black' : 'black', marginLeft: 20, marginVertical: 20, fontSize: 24, width: '85%', fontWeight: '600' }}>USER 1</Text>
            <Text style={{  color: isDarkMode ? 'gray' : 'gray', marginLeft: 20, marginVertical: 0, fontSize: 18, width: '85%', fontWeight: '600' }}>PEGAWAI</Text>
                                                                                                                                                                {/* 
                                                                                                                                                                            <View>
                                                                                                                                                                                <Text>Ganti Kata Kunci</Text>
                                                                                                                                                                            </View>


                                                                                                                                                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20 }}>
                                                                                                                                                                                <FontAwesomeIcon icon={faRightFromBracket} color='red' />
                                                                                                                                                                                <Text style={{  color: isDarkMode ? 'red' : 'red', fontSize: 18}} >Keluar</Text>
                                                                                                                                                                            </View> */}

        </View>
     <View style={styles.navGroup}>
          <TouchableHighlight style={styles.dealerButton}  onPress={() => navigation.navigate('Dealer')}>
            <Text style={{ color: active === "dealer" ? 'white' : 'black', backgroundColor: active === "dealer" ? '#1455A3' : 'white',}}>
              Dealer
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={{ color: isDarkMode ? 'black' : 'black', }}>
              <FontAwesomeIcon icon={faUser} color='white' />
            </Text>
          </TouchableHighlight>
      </View>
    </>
  )
}

const styles = StyleSheet.create({  
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
      backgroundColor: 'white',
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
      backgroundColor: '#1455A3',
      height: '80%',
      borderRadius: 20,
      marginHorizontal: 10,
      marginVertical: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
     
    },
  
  })
  


export default Profile