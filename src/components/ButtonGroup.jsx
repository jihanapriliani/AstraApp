import { StyleSheet, View, TouchableHighlight, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';


import { getDatabase, ref, get, child } from "firebase/database";
import FIREBASE from '../config/firebase';

 const ButtonGroup = (props) => {
    const {selectedCity, setSelectedCity} = props;
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const database = getDatabase(FIREBASE);
        const dataRef = ref(database);
        get(child(dataRef, 'Cities')).then((snapshot) => {
            if (snapshot.exists()) {
              setCities(snapshot.val());
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
        });
    }, [])



    return (
        <ScrollView horizontal={true}>
            <View style={styles.buttonGroup}>
                {cities.map(city => (
                    <View key={city.id} style={[styles.button, selectedCity === city.id && { backgroundColor: '#FDCA40' }]}>
                        <TouchableHighlight activeOpacity={0.8}
                    underlayColor="#FDCA40" onPress={() => setSelectedCity(city.id)}>
                            <Text style={styles.text}>
                                {city.city}
                            </Text>
                        </TouchableHighlight>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonGroup : {
        zIndex: 1000,
        marginVertical: 20,
        marginHorizontal: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'scroll'
    },

    button : {
        maxWidth: 100,
        height: 45,
        margin: 5,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#8D8D8D40',
        
    },

    text: {
        textAlign: 'center',
        color: '#000',
    }


})

export default ButtonGroup;