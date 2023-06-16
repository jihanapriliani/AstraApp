import {StyleSheet, View, TouchableHighlight, Text, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';

import {getDatabase, ref, get, child} from 'firebase/database';
import FIREBASE from '../config/firebase';

const Cards = props => {
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

  
  
  return( 
      <ScrollView style={{flexGrow: 1}}>
        <View>
            {
                
                Object.keys(dealers).map((key, index) =>  index < 4 && (
                    <TouchableHighlight key={key} style={styles.cardWrapper} onPress={() => navigation.navigate('ListTasks', { key: key, dealer: dealers[key] })}>
                        <View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>
                                    {dealers[key]}
                                </Text>
                            </View>
                
                            <View>
                                <Text>Nama Ketua Dealer {index + 1}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                ))
            }
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  cardTitle: {
    fontSize: 16,
    padding: 5
  },

  cardWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 150,
    borderRadius: 20,
    backgroundColor: "#417CC2",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardContent: {
    borderRadius: 10,
    width: '80%',
    height: '50%',
    backgroundColor: "#F8F8F8"
  }
});

export default Cards;
