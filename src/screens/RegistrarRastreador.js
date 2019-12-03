import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Keyboard, Alert, TouchableOpacity } from 'react-native'
import Header from '../components/Header'
import AuthInput from '../components/AuthInput'
import TrackersModelsPicker from '../components/TrackersModelsPicker'
import Button from '../components/Button'
import axios from 'axios'
import { server, showError } from '../common'
import AsyncStorage from '@react-native-community/async-storage'

export default class RegistrarRastreador extends Component {

  state = {
    serial: '',
    telefone: '',
    operadora: '',
    idModelo: '',
    obs: '',
    idCliente: '',
    idRevenda: '',
    trackers: []
  }

  componentDidMount = async () => {
    await this.loadUserData()
    await this.loadTrackersModels()
  }

  saveTracker = async () => {
    try {
      await axios.post(`${server}/trackers`, this.state)

      Keyboard.dismiss()
      Alert.alert('Rastreador cadastrado com Sucesso!')
      this.props.navigation.navigate('CadastroVeiculos')
    } catch (err) {
      showError(err.response.data)
    }
  }

  loadUserData = async () => {
    try {
      const res = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(res)

      this.setState({
        idCliente: userData.id,
        idRevenda: userData.idRevenda
      })

    } catch (err) {
      showError(err.response.data)
    }
  }

  loadTrackersModels = async () => {
    try {
      const res = await axios.get(`${server}/trackers`)
      this.setState({trackers: res.data})
    } catch (err) {
      showError(err.response.data)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} title={'Cadastrar Rastreador'} />
        <View style={styles.formContainer}>
          <ScrollView>
            <Text style={styles.title}>Número de Série do Rastreador</Text>
            <AuthInput placeholder='Ex: AD25c4R9hIK36' style={styles.input} value={this.state.serial} onChangeText={serial => this.setState({ serial })} />
            <Text style={styles.title}>Número da Linha do Chip Utilizado</Text>
            <AuthInput keyboardType={'numeric'} placeholder='Ex: 11-99898-5588' style={styles.input} value={this.state.telefone} onChangeText={telefone => this.setState({ telefone })} />
            <Text style={styles.title}>Operadora de Celular</Text>
            <AuthInput placeholder='Vivo, Claro, Tim, Oi, etc...' style={styles.input} value={this.state.operadora} onChangeText={operadora => this.setState({ operadora })} />
            <Text style={styles.title}>Modelo Rastreador</Text>
            {this.state.trackers.length > 0 &&
              <TrackersModelsPicker types={this.state.trackers} model={this.state.idModelo} setModel={ id => this.setState({idModelo: id})} />
            }
            <Text style={styles.title}>Observações</Text>
            <AuthInput placeholder='Observações' style={styles.input} value={this.state.obs} onChangeText={obs => this.setState({ obs })} />
          </ScrollView>
        </View>
        <TouchableOpacity onPress={this.saveTracker} style={{width: '80%'}}>
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
    fontSize: 16
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