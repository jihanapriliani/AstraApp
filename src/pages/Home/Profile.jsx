import { View, Text, useColorScheme, TouchableHighlight, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket'
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox'


import FIREBASE from '../../config/firebase';
import { getDatabase, get, ref, child } from 'firebase/database'
import { getAuth, signOut } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({navigation, route}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [active, setActive] = useState("profile");
  const auth = getAuth(FIREBASE);

  const [data, setData] = useState({});
  let { uid } = route.params;


  useEffect(() => {
    const database = ref(getDatabase(FIREBASE));
    console.log(uid);
    get(child(database, `Users/-NYfCiw76LhxvjdgXkyf/${uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [])

  return (
    <View style={styles.home}>
      <View>
        <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 28, color: 'black', fontWeight: '700', marginBottom: 10   }}>{data.fullname}</Text>
            
              <Text style={{ color: isDarkMode ? 'gray' : 'gray', fontSize: 16, textTransform: 'uppercase' }}>
                {data.role}
              </Text>
        </View>

        <View>
            <TouchableHighlight underlayColor={'white'} style={styles.actionButton} onPress={() => navigation.navigate('ChangePassword')}>
                <>
                    <FontAwesomeIcon icon={faKey} color='black' style={{ marginRight: 5 }} />
                    <Text style={{ color: isDarkMode ? 'black' : 'black', fontWeight: '700'}}>Ganti Kata Kunci</Text>
                </>
            </TouchableHighlight>

            <TouchableHighlight underlayColor={'white'} style={styles.actionButton} onPress={() => {
              signOut(auth)
              AsyncStorage.removeItem("@user");
              navigation.navigate('Login')
            }}>
                <>
                    <FontAwesomeIcon  icon={faRightFromBracket} color='#DD2C32' style={{ marginRight: 5, transform: [{rotate: '180deg'}] }} />
                    <Text style={{ color: '#DD2C32', fontWeight: '700' }}>Logout</Text>
                </>
            </TouchableHighlight>
        </View>



      </View>

      <View style={styles.navGroup}>
          <TouchableOpacity style={styles.dealerButton} onPress={() => navigation.navigate('Dealer')}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? 'black' : 'black', }}>
                <FontAwesomeIcon icon={faInbox} color='#1455A3' />
              </Text>
              <Text style={{ color: "#1455A3", backgroundColor: 'white',}}>
                Dealer
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} underlayColor={'#1455A3'} onPress={() => navigation.navigate('Profile', {'uid': user.uid})}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? 'black' : 'black', }}>
                <FontAwesomeIcon icon={faUser} color='white' />
              </Text>
              <Text style={{ color: "white", backgroundColor: "#1455A3"}}>
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
      height: '100%',
      paddingTop: 30,
    },
  
    cityButton : {
      display: 'flex',
      padding: 40
    },

    actionButton: {
        display: 'flex',
        flexDirection: 'row',
        margin: 20,
        marginVertical: 10,
        alignItems: 'center',
        padding: 5,
        borderRadius: 10
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