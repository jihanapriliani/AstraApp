import {StyleSheet, View, TouchableHighlight, Text, ScrollView, Alert, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';

import {getDatabase, ref, get, child} from 'firebase/database';
import FIREBASE from '../config/firebase';
import ExportButtonDealer from './ExportButtonDealer';

const Cards = props => {
  const isDarkMode = useColorScheme() === 'dark';

  const { selectedCity, navigation } = props;
  const [dealers, setDealers] = useState({});


  useEffect(() => {
    const database = getDatabase(FIREBASE);
    const dataRef = ref(database);
    get(child(dataRef, 'Dealers'))
      .then(snapshot => {
        if (snapshot.exists()) {
          setDealers(snapshot.val()[selectedCity]);
        } else {
          console.log('No data available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [selectedCity]);

  const styles = StyleSheet.create({

    cardTitle: {
      fontSize: 16,
      padding: 5,
      fontWeight: '700',
      width: 250,
      color: isDarkMode ? 'black' : 'black',
    },
  
    cardWrapper: {
      marginHorizontal: 20,
      marginVertical: 10,
      maxHeight: 130,
      borderRadius: 20,
      backgroundColor: "#417CC2",
      display: 'flex',
      paddingVertical: 15,
      alignItems: 'center',

      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6,
    },
  
    cardContent: {
      borderRadius: 10,
      width: '80%',
      height: 70,
      backgroundColor: "#F8F8F8",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10
      // justifyContent: 'center'
    },

    cirle: {
      width: 20,
      height: 20,
      marginRight: 5,
      borderRadius: 10,
      backgroundColor: "#D9D9D9"
    }
  });

  
  
  return( 
      <ScrollView style={{flexGrow: 1}}>
        <View>
            {
                
                Object.keys(dealers).map((key, index) =>   (
                    <TouchableHighlight  activeOpacity={0.8}
                    underlayColor="#417CC2" key={key} style={styles.cardWrapper} onPress={() => navigation.navigate('ListTasks', { key: key, dealer: dealers[key], dealer_id: key })}>
                        <View>
                            <View style={styles.cardContent}>
                              <View style={styles.cirle}></View>
                                <Text style={styles.cardTitle}>
                                    {dealers[key]}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                ))
            }
        </View>
    </ScrollView>
  );
};



export default Cards;
