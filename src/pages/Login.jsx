import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, useColorScheme, Pressable } from 'react-native';
import FIREBASE from '../config/firebase';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(FIREBASE);

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder="Email"
        value={email}
        onChangeText={(val) => setEmail(val)}
      />
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
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    color: '#3740FE',
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#3740FE',
    padding: 15,
    
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
