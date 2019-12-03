import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native'

export default class PositionMarker extends Component {

  startAnimation() {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start()
  }

  componentDidMount = () => {
    this.startAnimation()
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.externalMarker, {
          transform: [{
            scaleX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2]
            })
          },
          {
            scaleY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2]
            })
          }],
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.1],
          })
        }]} >
        </Animated.View>
        <View style={styles.centerMark} />
      </View>
    )

  }
}

const animation = new Animated.Value(0)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  externalMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'cyan',
  },
  centerMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'slateblue'
  }
})