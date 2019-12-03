import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default button = props => {
  return (
      <View style={styles.button}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'slateblue',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20
  }
})
