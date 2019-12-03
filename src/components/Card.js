import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import CarOptions from './CarOptions'
import Icon from 'react-native-vector-icons/Ionicons'
import StatusIcon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { server, showError } from '../common'

export default class Card extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      id: this.props.id,
      ignicao: this.props.ignicao,
      marca: this.props.marca,
      modelo: this.props.modelo,
      panico: this.props.panico,
      placa: this.props.placa,
      tracker: this.props.tracker,
      color: {
        on: '#7cfc00',
        off: '#CCC',
        alerta: '#ff4500'
      }
    }
  }

  cardColors = () => {
    if (this.state.panico == '1') {
      return ['#ff4500', '#ff4500']
    } else {
      return ['slateblue', 'slateblue']
    }
  }

  tooglePanico = async () => {
    let comando = '';
    this.state.panico == 0 ? comando = 'MODO_EMERGENCIA' : comando = 'DESLIGAR_MODO_EMERGENCIA'
    try {
      await axios.post(`${server}/comando/${this.props.tracker}`, {comando})
    } catch (err) {
      showError(err.response.data)
    }
  }

  render() {
    return (
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={this.cardColors()} style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Localizacao', { ...this.props })}>
          <View style={styles.carContainer}>
            <View style={styles.iconCarContainer}>
              <Icon name="ios-car" size={40} color={this.state.panico ? '#ff4500' : 'slateblue'} />
            </View>
            <View style={styles.carInfo}>
              <Text style={styles.subtitle}>{this.state.marca} {this.state.modelo} - {this.state.tracker}</Text>
              <Text style={styles.title}>{this.state.placa}</Text>
              <View style={styles.statusContainer}>
                <Text style={styles.subtitle}>Ignição   <StatusIcon name="circle" color={this.state.ignicao == 1 ? this.state.color.on : this.state.color.off} size={16} /></Text>
                <Text style={styles.subtitle}>Pânico   <StatusIcon name="circle" color={this.state.panico == 1 ? this.state.color.on : this.state.color.off} size={16} /></Text>
              </View>
            </View>
            <View style={styles.dotIconContainer}>
              <View>
                <CarOptions id={this.state.id} {...this.props} tooglePanico={() => this.tooglePanico()} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '90%',
    borderRadius: 4,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 8
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#EEE',
    marginBottom: 3,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#EEE',
    textAlign: 'center',
    // marginBottom: 5
  },
  carContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  carInfo: {
    flex: 4,
  },
  iconCarContainer: {
    flex: 1,
    maxWidth: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE',
    borderRadius: 5,
    marginRight: 15,
    marginLeft: 5
  },
  dotIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})