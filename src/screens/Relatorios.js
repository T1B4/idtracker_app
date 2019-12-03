import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native"
import Header from "../components/Header"
import TimeButton from "../components/TimeButton"
import moment from "moment"
import DateTimePicker from 'react-native-modal-datetime-picker'
import axios from 'axios'
import { server, showError } from '../common'

class Relatorios extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start: moment().subtract(1, 'hours').toDate(),
      end: moment().toDate(),
      show: false,
      tracker: this.props.navigation.getParam('tracker'),
      identifier: null,
      mode: null,
      isLoading: false,
    }
  }

  _setTimeHasPass = props => {
    this.setState({
      start: moment().subtract(props.qtd, props.unit).toDate(),
      end: moment().toDate()
    })
  }

  _getOdometerTotal = async () => {
    this.setState({
      isLoading: true
    })
    try {
      const res = await axios.post(`${server}/monitor/${this.state.tracker}/odometro`, {
        start: moment(this.state.start).unix(),
        end: moment(this.state.end).unix()
      })
      if (res.data.length > 1) {
        const total = res.data[0].odometro - res.data[res.data.length - 1].odometro
        Alert.alert(`O veículo placa ${this.props.navigation.getParam('placa')} percorreu um total de ${total} Km.`)
      }
      this.setState({
        isLoading: false
      })
    } catch (err) {
      showError(err.response.data)
    }
  }

  setDate = (date) => {
    switch (this.state.identifier) {
      case 'start':
        this.setState({
          start: moment(date).toDate(),
          show: false,
          identifier: null,
          mode: null
        })
        break;
      case 'end':
        this.setState({
          end: moment(date).toDate(),
          show: false,
          identifier: null,
          mode: null
        })
        break;

      default:
        break;
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
        <Header title={'Relatórios'} {...this.props} />
        <View style={[styles.buttonsContainer, { marginTop: 50 }]}>
          <TimeButton label='Ultimas 12 Horas' color='slateblue' fontSize={16} fontColor='#FFF' onPress={() => { this._setTimeHasPass({ qtd: 12, unit: 'hour' }) }} />
          <TimeButton label='Ultimas 24 Horas' color='slateblue' fontSize={16} fontColor='#FFF' onPress={() => { this._setTimeHasPass({ qtd: 24, unit: 'hour' }) }} />
        </View>
        <View style={styles.buttonsContainer}>
          <TimeButton label='Ultimos 7 dias' color='slateblue' fontSize={16} fontColor='#FFF' onPress={() => { this._setTimeHasPass({ qtd: 7, unit: 'days' }) }} />
          <TimeButton label='Ultimos 15 dias' color='slateblue' fontSize={16} fontColor='#FFF' onPress={() => { this._setTimeHasPass({ qtd: 15, unit: 'days' }) }} />
        </View>
        <View style={styles.buttonsContainer}>
          <TimeButton label='Ultimos 30 dias' color='slateblue' fontSize={16} fontColor='#FFF' onPress={() => { this._setTimeHasPass({ qtd: 30, unit: 'days' }) }} />
          <TimeButton label='Ultimos 45 dias' color='slateblue' fontSize={16} fontColor='#FFF' onPress={() => { this._setTimeHasPass({ qtd: 45, unit: 'days' }) }} />
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.dateTimeLabel}>
            <View style={{ paddingHorizontal: 10, minWidth: 100 }}>
              <Text>Data e Hora Inicial</Text>
            </View>
            <View style={{ paddingHorizontal: 10, minWidth: 100 }}>
              <Text>Data e Hora Final</Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <TimeButton label={moment(this.state.start).format("DD/MM/YYYY HH:mm")} color='grey' fontSize={16} fontColor='#FFF' onPress={() => {
              this.setState({ show: true, identifier: 'start' })
            }} />
            <TimeButton label={moment(this.state.end).format("DD/MM/YYYY HH:mm")} color='grey' fontSize={16} fontColor='#FFF' onPress={() => {
              this.setState({ show: true, identifier: 'end' })
            }} />
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <TimeButton label='Posições' color='slateblue' fontSize={20} fontColor='#FFF' marginBottom={30} onPress={() => this.props.navigation.navigate('Trajetos', { ...this.props.navigation.state.params, start: this.state.start, end: this.state.end })} />
          <TimeButton label='Odômetro' color='slateblue' fontSize={20} fontColor='#FFF' onPress={() => this._getOdometerTotal()} />
        </View>
        < DateTimePicker
          isVisible={this.state.show}
          date={this.state.start}
          mode={'datetime'}
          is24Hour={true}
          onConfirm={date => this.setDate(date)}
          onCancel={() => this.setState({ show: false })} />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  dateContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  timeContainer: {
    marginTop: 40,
    padding: 10
  },
  optionsContainer: {
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center'
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
  dateTimeLabel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})

export default Relatorios