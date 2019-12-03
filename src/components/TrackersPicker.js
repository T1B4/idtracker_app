import React from 'react'
import { StyleSheet, View, Picker } from 'react-native'

export default props => {

  const start = props.types
  if (props.types[0].id != 0) {
    start.unshift({ id: '0', s_number: 'Selecione um rastreador...' })
  }
  const items = start.map((item) => { return <Picker.Item label={item.s_number} value={item.s_number} key={item.id} /> })

  return (
    <View style={styles.container}>
      <Picker
        style={styles.input}
        selectedValue={props.sNumber}
        onValueChange={(itemValue, itemIndex) => {
          props.setSNumber(itemValue)
        }}>
        {items}
      </Picker>
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
  input: {
    marginLeft: 20,
    width: '95%',
  }
})