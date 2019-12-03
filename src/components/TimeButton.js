import React from "react";
import { StyleSheet, TouchableNativeFeedback, View, Text } from "react-native";


export default TimeButton = props => {
  return (
    <TouchableNativeFeedback onPress={() => {props.onPress()}}>
      <View style={[styles.timeButton, {backgroundColor: props.color, marginBottom: props.marginBottom}]}>
        <Text style={{fontSize: props.fontSize, color: props.fontColor}}>{props.label}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

const styles = StyleSheet.create({
  timeButton: {
    alignItems: 'center',
    minWidth: 150,
    minHeight: 40,
    padding: 10,
    borderRadius: 4,
    elevation: 10
  }
})