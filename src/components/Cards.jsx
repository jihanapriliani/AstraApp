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
      height: 130,
      borderRadius: 20,
      backgroundColor: "#417CC2",
      display: 'flex',
      paddingTop: 15,
      // justifyContent: 'center',
      alignItems: 'center'
    },
  
    cardContent: {
      borderRadius: 10,
      width: 280,
      height: 70,
      backgroundColor: "#F8F8F8",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10
      // justifyContent: 'center'
    },

    cirle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#D9D9D9"
    },

    dotContainer: {
      height: 20,
      width: 30,
      backgroundColor: 'white',
      marginRight: 5,
      marginTop: 10,
      fontSize: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },

    dot : {
      fontSize: 20,
      lineHeight: 15,
      color: '#417CC2',
      fontWeight: 'bold',
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
                
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                              
                              <ExportButtonDealer dealer={key} />
                               
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
