import React, { useState } from 'react'
import { Button, StyleSheet, View, Text, useColorScheme, TouchableHighlight } from 'react-native'
import DatePicker from 'react-native-date-picker'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'


export default (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const {selectedDate, setSelectedDate} = props;
  const [open, setOpen] = useState(false);

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const styles = StyleSheet.create({
    cityButton: {
      backgroundColor: '#B9B9B9',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,

      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 5,
    }
  })

  return (
    <View style={{ margin: 20, display: 'flex', flexDirection: 'row' }}>
      <Text style={{ marginBottom: 10, color: isDarkMode ? 'gray' : 'gray', marginRight: 20 }}>
        {formatDate(selectedDate)}
      </Text>
      <View style={styles.cityButton}>
        <TouchableHighlight activeOpacity={0.8} underlayColor="gray"  onPress={() => setOpen(true)}>
          <Text style={{ fontWeight: "500", color: "#fff" }}>
           <FontAwesomeIcon icon={faCalendarDays} color='white' />
          </Text>
        </TouchableHighlight>
     </View>
      <DatePicker
        modal
        open={open}
        mode='date'
        date={selectedDate}
        onConfirm={(date) => {
          setOpen(false)
          setSelectedDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </View>
  )
}


