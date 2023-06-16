import React, { useState } from 'react'
import { Button, StyleSheet, View, Text } from 'react-native'
import DatePicker from 'react-native-date-picker'

export default (props) => {
  const {selectedDate, setSelectedDate} = props;
  const [open, setOpen] = useState(false);

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <View style={{ margin: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        {formatDate(selectedDate)}
      </Text>
      <Button title="Pilih Tanggal" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
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


