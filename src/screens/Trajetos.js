import React, { Component } from 'react'
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native'
import RouteMap from '../components/RouteMap'
import axios from 'axios'
import { server, showError } from '../common'
import moment from 'moment'

export default class Trajetos extends Component {

  interval = ''

  constructor(props) {
    super(props)
    this.state = {
      placa: this.props.navigation.getParam('placa'),
      modelo: this.props.navigation.getParam('modelo'),
      tracker: this.props.navigation.getParam('tracker'),
      idVeiculo: this.props.navigation.getParam('id'),
      panico: this.props.navigation.getParam('panico'),
      rota: [],
      isLoading: false,
      start: this.props.navigation.getParam('start'),
      end: this.props.navigation.getParam('end')
    }
  }

  componentDidMount = () => {
    this._getLocalePositions(this.state.tracker)
  }

  _getLocalePositions = async () => {
    this.setState({
      isLoading: true
    })
    try {
      const res = await axios.post(`${server}/monitor/${this.state.tracker}/list`, {
        start: moment(this.state.start).unix(),
        end: moment(this.state.end).unix()
      })
      if (res.data.length > 1) {
        this.setState({
          isLoading: true,
          rota: res.data
        })
      }
      this.setState({
        isLoading: false,
      })
    } catch (err) {
      showError(err.response.data)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading &&
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={"#FFFFFF"} />
            <Text style={{ color: '#FFF', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>Aguarde um instante...</Text>
          </View>
        }
        {this.state.rota.length > 2 &&
          <RouteMap
            rota={this.state.rota}
            placa={this.state.placa}
            modelo={this.state.modelo}
            {...this.props}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'slateblue',
    elevation: 20
  },
})