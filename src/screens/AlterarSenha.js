import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, Keyboard } from 'react-native'
import axios from 'axios'
import AuthInput from '../components/AuthInput'
import { server, showError } from '../common'
import Button from '../components/Button'
import Header from '../components/Header'

export default class AlterarSenha extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.navigation.getParam('id'),
      email: this.props.navigation.getParam('email'),
      senhaAntiga: '',
      novaSenha: '',
      novaSenhaConfirmar: ''
    }
  }

  atualizaSenha = async () => {
    if (this.state.novaSenha != this.state.novaSenhaConfirmar) {
      Alert.alert('Senhas Diferentes', 'Atenção, sua nova senha não foi digitada corretamente no campo de confirmação, digite as duas senhas novamente e clique em salvar.')
    }

    try {
      await axios.put(`${server}/cliente/${this.state.userId}/senha`, {
        id: this.state.userId,
        email: this.state.email,
        oldPassword: this.state.senhaAntiga,
        password: this.state.novaSenha
      })

      Keyboard.dismiss()

      Alert.alert('Senha alterada com sucesso')

      this.props.navigation.navigate('Profile')

    } catch (err) {
      showError(err.response.data)
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={'Atualização de Senha'} />
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Insira sua senha atual</Text>
          <AuthInput style={{marginBottom: 10}} value={this.state.senhaAntiga} onChangeText={senhaAntiga => this.setState({ senhaAntiga })} />
          <Text style={styles.inputLabel}>Insira sua Nova Senha</Text>
          <AuthInput style={{marginBottom: 10}} value={this.state.novaSenha} onChangeText={novaSenha => this.setState({ novaSenha })} />
          <Text style={styles.inputLabel}>Repita sua Nova Senha</Text>
          <AuthInput style={{marginBottom: 10}} value={this.state.novaSenhaConfirmar} onChangeText={novaSenhaConfirmar => this.setState({ novaSenhaConfirmar })} />
          <TouchableOpacity onPress={() => this.atualizaSenha()} >
            <Button text={'Salvar Nova Senha'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    padding: 10,
  },
  inputLabel: {
    marginLeft: 22,
    marginBottom: 5,
  }
})