import React, { Component } from 'react'
import { View, StyleSheet, Text, Alert } from 'react-native'
import Map from '../components/Map'
import axios from 'axios'
import { server, showError } from '../common'
import moment from 'moment'

export default class Localizacao extends Component {

  interval = ''

  constructor(props) {
    super(props)
    this.state = this.initialState
  }

  componentDidMount = () => {
    this.getLocale(this.state.tracker)
    this.interval = setInterval(() => {
      this.getLocale(this.state.tracker)
    }, 50000)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  initialState = {
    lat: 0,
    long: 0,
    time: moment(new Date()).unix(),
    placa: this.props.navigation.getParam('placa'),
    modelo: this.props.navigation.getParam('modelo'),
    tracker: this.props.navigation.getParam('tracker'),
    idVeiculo: this.props.navigation.getParam('id'),
    panico: this.props.navigation.getParam('panico'),
  }

  getLocale = async () => {
    try {
      const res = await axios.get(`${server}/monitor/${this.state.tracker}`)
      if (res.data) {
        let lat = res.data.lat
        let long = res.data.lon
        let time = res.data.timestamp
        this.setState({ lat, long, time })
      } else {
        Alert.alert('Um momento...', 'Não foram encontradas coordenadas ainda mas não se preocupe, provavelmente isso é porque se trata de uma instalação nova ou de uma migração, em alguns minutos o aparelho irá terminar de inicializar e as coordenadas começarão a serem enviadas.')
      }
    } catch (err) {
      showError(err.response.data)
    }
  }

  tooglePanico = async () => {
    let comando = '';
    try {
      this.state.panico == 0 ? comando = 'MODO_EMERGENCIA' : comando = 'DESLIGAR_MODO_EMERGENCIA'
      const res = await axios.post(`${server}/comando/${this.state.tracker}`, {
        comando,
      })
      if (res) {
        this.setState({ panico: this.state.panico == 0 ? 1 : 0 })
      }
    } catch (err) {
      showError(err.response.data)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Map
          lat={this.state.lat}
          long={this.state.long}
          time={this.state.time}
          placa={this.state.placa}
          modelo={this.state.modelo}
          trajeto={this.state.trajeto}
          {...this.props}
          tooglePanic={this.tooglePanico}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})