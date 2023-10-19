import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, useColorScheme, Pressable } from 'react-native';
import FIREBASE from '../config/firebase';
import { getAuth, updatePassword } from 'firebase/auth'

const ChangePassword = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = getAuth(FIREBASE);
  const user = auth.currentUser;

  const changePass = async () => {
    if (currentPassword === '' && newPassword === '') {
      Alert.alert('Tolong Isi Password Lama dan Baru Anda!')
    } else {
      setIsLoading(true);
      
      try {
          await updatePassword(user, newPassword)
            .then((userCredential) => {
              setnewPassword('');
              setcurrentPassword('');
              setIsLoading(false);

              Alert.alert('Berhasil', 'Password Berhasil Diperbarui!');
              navigation.navigate('Dealer');
            })
            .catch(err => {
              setIsLoading(false);
              Alert.alert(err.message);
            });

        console.log(user);
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
      <Text style={{ color: isDarkMode ? 'black' : 'black'}}>Password Saat ini</Text>
      <TextInput
        style={{ ...styles.inputStyle, color: isDarkMode ? 'black' : 'black' }}
        placeholder="Password"
        value={currentPassword}
        onChangeText={(val) => setcurrentPassword(val)}
       
      />

      <Text style={{ color: isDarkMode ? 'black' : 'black'}}>Password Baru</Text>
      <TextInput
        style={{ ...styles.inputStyle, color: isDarkMode ? 'black' : 'black' }}
        placeholder="Password"
        value={newPassword}
        onChangeText={(val) => setnewPassword(val)}
        maxLength={15}
        // secureTextEntry={true}
      />
      <Pressable style={styles.loginButton}>
        <Text style={{ color: 'white', textAlign: 'center' }} onPress={changePass}>
            Ubah Password
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
    color: '#1455A3',
  },
  loginText: {
    color: '#1455A3',
    marginTop: 25,
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#1455A3',
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

export default ChangePassword;
