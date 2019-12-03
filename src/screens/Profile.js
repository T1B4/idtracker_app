import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Keyboard, Alert, TouchableOpacity, Picker } from 'react-native'
import Header from '../components/Header'
import AuthInput from '../components/AuthInput'
import axios from 'axios'
import { server, showError } from '../common'
import AsyncStorage from '@react-native-community/async-storage'
import Button from '../components/Button'

export default class Profile extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return ({
      id: '',
      nomeFantasia: '',
      usuario: '',
      razaoSocial: '',
      cpfCnpj: '',
      cep: '',
      endereco: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: '',
      email: '',
      telefone: '',
      tipoCadastro: '',
      dataCadastro: '',
      clientData: [],
      types: ['Pessoa Fisica', 'Pessoa Juridica']
    })
  }

  componentDidMount = async () => {
    await this.loadUserData()
    await this.getUserData()
  }

  loadUserData = async () => {
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

  getUserData = async () => {
    try {
      const res = await axios.get(`${server}/cliente/${this.state.id}`)
      this.setState({
        clientData: res.data,
        nomeFantasia: res.data[0].nome_fantasia,
        usuario: res.data[0].usuario,
        email: res.data[0].email,
        razaoSocial: res.data[0].razao_social,
        cpfCnpj: res.data[0].cpf_cnpj,
        cep: res.data[0].cep,
        endereco: res.data[0].endereco,
        bairro: res.data[0].bairro,
        cidade: res.data[0].cidade,
        estado: res.data[0].estado,
        pais: res.data[0].pais,
        telefone: res.data[0].telefone,
        tipoCadastro: res.data[0].tipo,
        dataCadastro: res.data[0].data_cadastro,
      })
    } catch (err) {
      showError(err.response.data)
    }
  }

  updateUserData = async () => {
    try {
      await axios.put(`${server}/cliente/${this.state.id}`, {
        nome_fantasia: this.state.nomeFantasia,
        usuario: this.state.usuario,
        email: this.state.email,
        razao_social: this.state.razaoSocial,
        cpf_cnpj: this.state.cpfCnpj,
        cep: this.state.cep,
        endereco: this.state.endereco,
        bairro: this.state.bairro,
        cidade: this.state.cidade,
        estado: this.state.estado,
        pais: this.state.pais,
        telefone: this.state.telefone,
        tipo: this.state.tipoCadastro,
      })

      Keyboard.dismiss()

      Alert.alert('Cadastro atualizado com sucesso')

      this.props.navigation.navigate('CadastroVeiculos')

    } catch (err) {
      showError(err.response.data)
    }
  }

  buscaCep = async cep => {
    this.setState({ cep })
    if (cep.length > 7) {
      const res = await axios.get(`http://viacep.com.br/ws/${cep}/json/`)
      if (res.data) {
        this.setState({
          bairro: res.data.bairro,
          endereco: res.data.logradouro,
          cidade: res.data.localidade,
          estado: res.data.uf
        })
      }
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} title={'Perfil'} />
        <ScrollView style={styles.scroll} centerContent={true}>
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Nome Fantasia</Text>
            <AuthInput value={this.state.nomeFantasia} onChangeText={nomeFantasia => this.setState({ nomeFantasia })} />
            <Text style={styles.subtitle}>Usuário</Text>
            <AuthInput value={this.state.usuario} onChangeText={usuario => this.setState({ usuario })} />
            <Text style={styles.subtitle}>E-mail</Text>
            <AuthInput keyboardType={'email-address'} value={this.state.email} onChangeText={email => this.setState({ email })} />
            <Text style={styles.subtitle}>Telefone</Text>
            <AuthInput keyboardType={'numeric'} value={this.state.telefone} onChangeText={telefone => this.setState({ telefone })} />
            <Text style={styles.subtitle}>Razão Social</Text>
            <AuthInput value={this.state.razaoSocial} onChangeText={razaoSocial => this.setState({ razaoSocial })} />
            <Text style={styles.subtitle}>CPF / CNPJ</Text>
            <AuthInput keyboardType={'numeric'} value={this.state.cpfCnpj} onChangeText={cpfCnpj => this.setState({ cpfCnpj })} />
            <Text style={styles.subtitle}>CEP</Text>
            <AuthInput keyboardType={'numeric'} value={this.state.cep} onChangeText={cep => this.buscaCep(cep)} />
            <Text style={styles.subtitle}>Endereço</Text>
            <AuthInput value={this.state.endereco} onChangeText={endereco => this.setState({ endereco })} />
            <Text style={styles.subtitle}>Bairro</Text>
            <AuthInput value={this.state.bairro} onChangeText={bairro => this.setState({ bairro })} />
            <Text style={styles.subtitle}>Cidade</Text>
            <AuthInput value={this.state.cidade} onChangeText={cidade => this.setState({ cidade })} />
            <Text style={styles.subtitle}>Estado</Text>
            <AuthInput value={this.state.estado} onChangeText={estado => this.setState({ estado })} />
            <Text style={styles.subtitle}>País</Text>
            <AuthInput value={this.state.pais} onChangeText={pais => this.setState({ pais })} />
            <Text style={styles.subtitle}>Tipo de Cadastro</Text>
            <View style={styles.inputContainer}>
              <Picker selectedValue={this.state.types} style={styles.input} mode={'dialog'} onValueChange={(itemValue, itemIndex) => { this.setState({ tipoCadastro: itemValue }) }}>
                <Picker.Item label={'Pessoa Fisica'} value={1} key={1} />
                <Picker.Item label={'Pessoa Juridica'} value={2} key={2} />
              </Picker>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AlterarSenha', {
              id: this.state.id,
              email: this.state.email
            })} >
              <Button text={'Alterar Senha'} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={this.updateUserData} style={{ width: '80%' }}>
          <Button text={'Salvar Dados'} />
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
  scroll: {
    width: '90%'
  },
  formContainer: {
    padding: 10,
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 10
  },
  inputContainer: {
    width: '100%',
    height: 40,
    backgroundColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20
  },
  input: {
    marginLeft: 20,
    width: '95%',
  }
})