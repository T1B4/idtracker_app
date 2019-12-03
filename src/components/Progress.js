import React from 'react'
import { StyleSheet, View, ActivityIndicator, Modal, Text } from 'react-native'

export default props => {

  return (
    <Modal visible={props.isVisible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <ActivityIndicator size={75} color="slateblue" />
        <Text style={{color: "#FFF", fontSize: 18, marginTop: 30}}>
          Recarregando alertas...
        </Text>
      </View >
    </Modal>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  }
})