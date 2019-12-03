import React from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default props => {

  return (
    <View style={[styles.container, props.style]}>
      {props.icon &&
        <TouchableOpacity onPress={props.onClean}>
          <Icon name={props.icon} size={20} style={styles.icon} />
        </TouchableOpacity>}
      <TextInput {...props} style={styles.input} value={props.value} disabled={props.disabled} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20
  },
  icon: {
    color: '#333',
    marginLeft: 20,
  },
  input: {
    marginLeft: 20,
    width: '70%',
  }
})