import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, ScrollView, Keyboard, TouchableOpacity, Picker, PickerItem } from 'react-native'
import Header from '../components/Header'
import AuthInput from '../components/AuthInput'
import OptionsPicker from '../components/OptionsPicker'
import TrackersPicker from '../components/TrackersPicker'
import { server, showError } from '../common'
import axios from 'axios'
import Button from '../components/Button'
import AsyncStorage from '@react-native-community/async-storage'

export default class RegistrarVeiculos extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return ({
      id: '',
      placa: '',
      marca: '',
      modelo: '',
      cor: '',
      ano: '',
      chassi: '',
      tipo: 0,
      velMax: '',
      idCliente: '',
      idTracker: 0,
      sNumber: '',
      types: [],
      trackers: []
    })
  }

  loadUserData = async () => {
    try {
      const res = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(res)
      this.setState({
        idCliente: userData.id,
      })
    } catch (err) {
      showError(err.response.data)
    }
  }

  loadVehiclesType = async () => {
    try {
      const res = await axios.get(`${server}/veiculos`)
      this.setState({ types: res.data })
    } catch (err) {
      console.log(err)
    }
  }

  loadTrackers = async () => {
    try {
      const res = await axios.get(`${server}/trackers/${this.state.idCliente}/list`)
      this.setState({ trackers: res.data })
    } catch (err) {
      showError(err.response.data)
    }
  }

  saveVehicle = async () => {
    try {
      await axios.post(`${server}/veiculos`, {
        placa: this.state.placa,
        marca: this.state.marca,
        modelo: this.state.modelo,
        cor: this.state.cor,
        ano: this.state.ano,
        chassi: this.state.chassi,
        tipo: this.state.tipo,
        velMax: this.state.velMax,
        idCliente: this.state.idCliente,
        idTracker: this.state.idTracker,
        sNumber: this.state.sNumber
      })

      Keyboard.dismiss()
      Alert.alert('Veículo cadastrado com Sucesso!')
      this.props.navigation.navigate('CadastroVeiculos', this.props)

    } catch (err) {
      Alert.alert('Não foi possível cadastrar o veículo', 'Por favor tente novamente em alguns instantes.')
    }
  }

  setTracker = sNumber => {
    this.setState( sNumber )
    this.state.trackers.filter(tracker => {
      this.setState({ idTracker: tracker.id })
    })
  }

  componentDidMount = async () => {
    await this.loadUserData()
    await this.loadVehiclesType()
    await this.loadTrackers()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} title={'Cadastrar Veículo'} />
        <View style={styles.formContainer}>
          <ScrollView>
            <Text style={styles.title}>Placa</Text>
            <AuthInput placeholder='Ex: DHG-3258' style={styles.input} value={this.state.placa.toString()} onChangeText={placa => this.setState({ placa })} />
            <Text style={styles.title}>Marca</Text>
            <AuthInput placeholder='Ex: Volkswagen' style={styles.input} value={this.state.marca.toString()} onChangeText={marca => this.setState({ marca })} />
            <Text style={styles.title}>Modelo</Text>
            <AuthInput placeholder='Ex: Gol' style={styles.input} value={this.state.modelo.toString()} onChangeText={modelo => this.setState({ modelo })} />
            <Text style={styles.title}>Cor</Text>
            <AuthInput placeholder='Ex: Branco' style={styles.input} value={this.state.cor.toString()} onChangeText={cor => this.setState({ cor })} />
            <Text style={styles.title}>Ano de Fabricação</Text>
            <AuthInput placeholder='Ex: 2009' style={styles.input} value={this.state.ano.toString()} onChangeText={ano => this.setState({ ano })} />
            <Text style={styles.title}>Númeração do Chassis</Text>
            <AuthInput placeholder='Ex: 354SA35ADSDF' style={styles.input} value={this.state.chassi.toString()} onChangeText={chassi => this.setState({ chassi })} />
            <Text style={styles.title}>Tipo do Veículo</Text>
            {this.state.types.length > 0 &&
              <OptionsPicker types={this.state.types} tipo={this.state.tipo} setTipo={tipo => this.setState({ tipo })} />
            }
            <Text style={styles.title}>Velocidade Máxima</Text>
            <AuthInput placeholder='Velocidade máxima de tráfego desejada para monitoramento' style={styles.input} value={this.state.velMax.toString()} onChangeText={velMax => this.setState({ velMax })} />
            <Text style={styles.title}>Rastreador</Text>
            {this.state.trackers.length > 0 &&
              <TrackersPicker types={this.state.trackers} sNumber={this.state.sNumber} setSNumber={(sNumber) => this.setTracker({ sNumber })} />
            }
          </ScrollView>
        </View>
        <TouchableOpacity onPress={this.saveVehicle} style={{ width: '80%' }}>
          <Button text={'Registrar'} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  formContainer: {
    marginTop: 10,
    width: '90%',
    flex: 1
  },
  title: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5
  },
  input: {
    marginTop: 5
  }
})