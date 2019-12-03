import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, ScrollView, Keyboard, TouchableOpacity } from 'react-native'
import Header from '../components/Header'
import AuthInput from '../components/AuthInput'
import { server, showError } from '../common'
import axios from 'axios'
import Button from '../components/Button'
import AsyncStorage from '@react-native-community/async-storage'
import OptionsPicker from '../components/OptionsPicker'

export default class AtualizarVeiculos extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    console.log(this.props)
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
      tipo: '',
      velMax: '',
      idCliente: '',
      idTracker: '',
      sNumber: '',
      types: []
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

  loadVeiculoData = async id => {
    try {
      const veic = await axios.get(`${server}/veiculos/${id}`)
      this.setState({
        id: id,
        placa: veic.data[0].placa ? veic.data[0].placa : '',
        marca: veic.data[0].marca ? veic.data[0].marca : '',
        modelo: veic.data[0].modelo ? veic.data[0].modelo : '',
        cor: veic.data[0].cor ? veic.data[0].cor : '',
        ano: veic.data[0].ano ? veic.data[0].ano : '',
        chassi: veic.data[0].chassi ? veic.data[0].chassi : '',
        tipo: veic.data[0].tipo_veiculo ? veic.data[0].tipo_veiculo : '',
        velMax: JSON.stringify(veic.data[0].vel_max) ? JSON.stringify(veic.data[0].vel_max) : '',
        idCliente: veic.data[0].id_cliente ? veic.data[0].id_cliente : '',
        idTracker: veic.data[0].id_tracker ? veic.data[0].id_tracker : '',
        sNumber: veic.data[0].s_number ? veic.data[0].s_number : '',
      })
      // this.props.navigation.setParams({ id: 0 })

    } catch (err) {
      showError(err.response.data)
    }
  }

  updateVehicle = async () => {
    try {
      await axios.post(`${server}/veiculos/${this.state.id}`, {
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
      Alert.alert('Cadastro atualizado com Sucesso!')
      this.props.navigation.navigate('CadastroVeiculos', this.props)

    } catch (err) {
      Alert.alert('Não foi possível atualizar os dados do veículo', 'Por favor tente novamente em alguns instantes.')
    }
  }

  componentDidMount = async () => {
    await this.loadUserData()
    await this.loadVeiculoData(this.props.navigation.getParam('id'))
    await this.loadVehiclesType()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} title={'Editar Veículo'} />
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Altere qualquer dos campos abaixo para atualizar o cadastro do veículo.</Text>
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
            <Text style={styles.title}>SN do Rastreador</Text>
            <AuthInput placeholder='Ex: 3235DFASDFAS2D' style={styles.input} value={this.state.sNumber.toString()} onChangeText={sNumber => this.setState({ sNumber })} />
          </ScrollView>
        </View>
        <TouchableOpacity onPress={this.updateVehicle} style={{ width: '80%' }}>
          <Button text={'Atualizar Cadastro'} />
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
    marginTop: 20,
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