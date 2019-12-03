import React from 'react'
import { StyleSheet, View, Picker } from 'react-native'

export default props => {

  const start = props.types
  if (props.types[0].id != 0) {
    start.unshift({ id: '0', nome: 'Selecione o tipo de veiculo...' })
  }

  const items = start.map((item) => { return <Picker.Item label={item.nome} value={item.id} key={item.id} /> })

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={props.tipo}
        style={styles.input}
        mode={'dialog'}
        onValueChange={(itemValue, itemIndex) => {
          props.setTipo(itemValue)
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