import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import moment from 'moment'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class AlertCard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hora: moment.unix(this.props.hora).format("DD/MM/YYYY H:mm:ss"),
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      animationVal: new Animated.Value(1)
    }
  }

  startAnimation = () => {
    Animated.timing(this.state.animationVal, {
      toValue: 2,
      duration: 600,
      useNativeDriver: true
    }).start()
  }

  onLayout = event => {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y
    })
  }

  leftRender = () => {
    return (
      <Animated.View style={[styles.excludeLeft, {
        transform: [
          {
            scaleY: this.state.animationVal,
          },
          {
            translateY: this.state.animationVal.interpolate({
              inputRange: [1, 2],
              outputRange: [1, -120],
            })
          }
        ]
      }]}>
        <Icon style={{ margin: 10 }} name='archive' size={20} color='#FFF' />
        <Text style={styles.excludeText}>Arquivar</Text>
      </Animated.View>
    )
  }

  righttRender = () => {
    return (
      <Animated.View style={[styles.excludeRight, {
        transform: [
          {
            scaleY: this.state.animationVal,
          },
          {
            translateY: this.state.animationVal.interpolate({
              inputRange: [1, 2],
              outputRange: [1, -100],
            })
          }
        ]
      }]}>
        <Icon style={{ margin: 10 }} name='archive' size={20} color='#FFF' />
        <Text style={styles.excludeText}>Arquivar</Text>
      </Animated.View>
    )
  }

  render() {
    return (
      <Swipeable
        renderLeftActions={() => this.leftRender()}
        renderRightActions={() => this.righttRender()}
        onSwipeableLeftOpen={() => {
          this.props.onDismiss(this.props.id)
          this.startAnimation()
        }}
        onSwipeableRightOpen={() => {
          this.props.onDismiss(this.props.id)
          this.startAnimation()
        }}
      >
        <Animated.View style={[styles.container, {
          transform: [
            {
              scaleY: this.state.animationVal,
            },
            {
              translateY: this.state.animationVal.interpolate({
                inputRange: [1, 2],
                outputRange: [1, -100],
              })
            }
          ]
        }]} onLayout={this.onLayout}>
          <View>
            <Text style={styles.title}>{this.props.alerta}</Text>
            <Text style={styles.subtitle}>Placa : {this.props.placa}</Text>
            <Text style={styles.subtitle}>{this.state.hora}</Text>
          </View>
        </Animated.View>
      </Swipeable >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '100%',
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 2
  },
  comandos: {
    minHeight: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    borderRadius: 22,
    backgroundColor: 'slateblue',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14
  },
  excludeRight: {
    flex: 1,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  excludeLeft: {
    flex: 1,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  excludeText: {
    color: '#FFF',
    fontSize: 20,
    margin: 10,
  }
})