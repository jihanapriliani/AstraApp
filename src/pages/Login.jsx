import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, useColorScheme, Pressable } from 'react-native';

import FIREBASE from '../config/firebase';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(FIREBASE);

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    checkLocalUser();
    console.log(userInfo);
  }, [])

  useEffect(() => {
    const getUid = async () => {
      try {
        const data = await AsyncStorage.getItem('@user');
        return data;
      } catch (error) {
        console.log(error);
        return null; // atau nilai default jika terjadi kesalahan
      }
    };

    getUid()
    .then((data) => {
      if(data && Object.keys(userInfo).length !== 0) {
        navigation.navigate('Dealer');
      } else {
        navigation.navigate('Login');

      }
    })
    .catch((error) => {
      console.log(error);
    })
  }, [userInfo])

  const checkLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch(e) {
      console.log(e);
    }
  }

  const userLogin = async () => {
    if (email === '' && password === '') {
      Alert.alert('Tolong Isi Email dan Password!')
    } else {
      setIsLoading(true);
      
      try {
          await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log("BERHASIL LOGIN");
              setEmail('');
              setPassword('');
              setIsLoading(false);

              AsyncStorage.setItem("@user", JSON.stringify(userCredential.user));

              navigation.navigate('Dealer');
            })
            .catch(err => {
              setIsLoading(false);
              Alert.alert(err.message);
            });
      } catch(e) {
        console.log(e);
      }


    }
  };

  if (isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return  (
      <View style={styles.container}>

        <Text style={{ ...styles.titleStyle, color: isDarkMode ? '#1455A3' : '#1455A3' }}>Login</Text>

        <Text  style={{ ...styles.labelStyle, color: isDarkMode ? '#1455A3' : '#1455A3' }}>Email</Text>
        <TextInput
          style={{ ...styles.inputStyle, color: isDarkMode ? '#1455A3' : '#1455A3' }}
          placeholder="Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Text style={{ ...styles.labelStyle, color: isDarkMode ? '#1455A3' : '#1455A3' }}>Password</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={password}
          onChangeText={(val) => setPassword(val)}
          maxLength={15}
          secureTextEntry={true}
        />
        <Pressable style={styles.loginButton}>
          <Text style={{ color: 'white', textAlign: 'center' }} onPress={userLogin}>
            Login
          </Text>
        </Pressable>
      </View>
  );
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 35,
    paddingTop: 150,
    backgroundColor: '#F8F8F8',
    position: 'relative'
  },

  titleStyle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    margin: 20,
  },

  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    color: '#1455A3',
    backgroundColor: 'white',
    borderBottomWidth: 0,
    borderRadius: 20,

    shadowColor: "#d9d6ce",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,

    marginBottom: 20
  },

  labelStyle: {
    color: '#1455A3',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
  },

  loginText: {
    color: '#1455A3',
    marginTop: 25,
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#1455A3',
    padding: 15,
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    borderRadius: 20,

    shadowColor: "#d9d6ce",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default Login;
