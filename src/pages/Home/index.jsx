import { Text, StyleSheet, View, Button } from 'react-native'
import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    const {navigation} = this.props;

    return (
      <View>
          <Button
            title="Add Task"
            onPress={() => navigation.navigate('AddTask')}
          />
          <Button
            title="List Task"
            onPress={() => navigation.navigate('ListTasks')}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({})