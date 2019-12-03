import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Alert } from 'react-native'
import Header from '../components/Header'
import axios from 'axios'
import { server, showError } from '../common'
import Card from '../components/Card'
import AsyncStorage from '@react-native-community/async-storage'
import AuthInput from '../components/AuthInput'

export default class CadastroVeiculos extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return ({
      id: '',
      usuario: '',
      email: '',
      busca: '',
      icon: 'search',
      listVeiculos: [],
      filterVeiculos: [],
      listUpdate: false
    })
  }

  componentDidMount = async () => {
    await this.getUserData()
    await this.listarVeiculos()
  }

  getUserData = async () => {
    try {
      const res = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(res)

      this.setState({
        id: userData.id,
        usuario: userData.usuario,
        email: userData.email,
      })

    } catch (err) {
      showError(err.response.data)
    }
  }

  listarVeiculos = async () => {
    try {
      const res = await axios.get(`${server}/veiculos/${this.state.id}/list`)
      const veiculos = res.data.filter( veiculo => {
        return veiculo.s_number != null || veiculo.s_number == ''
      })
      this.setState({ listVeiculos: veiculos })
      if (res.data.length < 1) {
        Alert.alert("Não foram encontrados veículos cadastrados.", "Não encontramos veículos cadastrados para seu código de cliente.")
      }
    } catch (err) {
      Alert.alert("Não foram encontrados veículos cadastrados.", "Não encontramos veículos cadastrados para seu código de cliente.")
    }
  }

  atualizarLista = props => {
    if (!props) {
      this.setState({ busca: '' })
      this.setState({ icon: 'search' })
      this.setState({ filterVeiculos: [] })
      return
    }
    const filterVeiculos = this.state.listVeiculos.filter(veiculo => {
      return veiculo.placa.includes(props.toUpperCase().trim())
    })
    this.setState({ filterVeiculos, busca: props.trim(), icon: 'times-circle' })
  }

  cleanForm = () => {
    this.setState({ busca: '', icon: 'search' })
    this.setState({ filterVeiculos: [] })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} title='Veículos' />
        <AuthInput icon={this.state.icon} onClean={this.cleanForm} placeholder="Digite a placa p/ buscar..." value={this.state.busca} style={styles.input} onChangeText={props => { this.atualizarLista(props) }} />
        <FlatList data={this.state.filterVeiculos.length > 0 ? this.state.filterVeiculos : this.state.listVeiculos} keyExtractor={item => `${item.id}`} renderItem={
          ({ item }) => <Card id={item.id} placa={item.placa.toUpperCase()} marca={item.marca} modelo={item.modelo} tracker={item.s_number} ignicao={item.ign} panico={item.pan} {...this.props} />
        }></FlatList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 15
  },
  title: {
    fontSize: 24
  },
  subtitle: {
    marginVertical: 10,
    fontSize: 16,
    color: '#222',
  },
  input: {
    marginTop: 12,
    marginBottom: 8,
    width: '95%',
  }
})