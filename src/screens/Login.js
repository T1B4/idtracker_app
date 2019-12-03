import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ToastAndroid, Linking, Image } from 'react-native'
import axios from 'axios'
import { server, showError } from '../common'
import AuthInput from '../components/AuthInput'
import backgroundImage from '../../assets/img/login.jpg'
import AsyncStorage from '@react-native-community/async-storage'
import Logo from '../../assets/img/logo.png'

export default class Login extends Component {

  state = {
    stageNew: false,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  signin = async () => {
    try {
      const res = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password,
      })

      if (res) {

        await AsyncStorage.setItem('userData', JSON.stringify(res.data))

        axios.defaults.headers.common['Authorization']
          = `bearer ${res.data.token}`

        this.props.navigation.navigate('Home', res.data)
        this.renderToast({ msg: 'Login efetuado com sucesso.' })

      }

    }
    catch (err) {
      showError(err.response.data)
    }
  }

  signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      })

      this.renderToast({ msg: 'Usuário registrado com sucesso, para acessar basta fazer o login.' })

      this.setState({ stageNew: false })
    } catch (err) {
      showError(err.response.data)
    }
  }

  lostPass = async () => {
    if (this.state.email) {
      try {
        await axios.post(`${server}/lostPassword`, {
          email: this.state.email
        })

        this.renderToast({ msg: 'Uma nova senha foi enviada para seu email, essa senha pode ser trocada posteriormente na área de cadastro do cliente' })

      } catch (err) {
        showError(err.response.data)
      }
    } else {
      this.renderToast({ msg: 'Para recuperar a senha é necessário preencher o campo de email' })
    }
  }

  signinOrSignup = () => {
    if (this.state.stageNew) {
      this.signup()
    } else {
      this.signin()
    }
  }

  renderToast = props => {
    ToastAndroid.showWithGravityAndOffset(
      props.msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      50,
    )
  }

  render() {
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Image source={Logo} style={styles.logo} />
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'}
          </Text>
          {this.state.stageNew &&
            <AuthInput icon='user' placeholder='Nome' style={styles.input} value={this.state.name} onChangeText={name => this.setState({ name })} />}
          <AuthInput icon='at' placeholder='E-mail' style={styles.input} value={this.state.email} onChangeText={email => this.setState({ email })} />
          <AuthInput icon='lock' secureTextEntry={true} placeholder='Senha' style={styles.input} value={this.state.password} onChangeText={password => this.setState({ password })} />
          {this.state.stageNew &&
            <AuthInput icon='asterisk' secureTextEntry={true} placeholder='Confirmar Senha' style={styles.input} value={this.state.confirmPassword} onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
          <TouchableOpacity onPress={this.signinOrSignup}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Registrar' : 'Entrar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
          <Text style={styles.buttonText}>{this.state.stageNew ? "Já possui conta?" : "Ainda não possui conta?"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toast} onPress={() => this.lostPass()}>
          <Text style={styles.buttonText}>{!this.state.stageNew ? "Perdeu sua Senha?" : ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footer} onPress={() => Linking.openURL('http://www.hospedaria.com.br/')}>
          <Text style={{ color: '#FFF' }}>Desenvolvido por Hospedaria Internet.</Text>
        </TouchableOpacity>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 50,
    marginBottom: 10,
  },
  subtitle: {
    color: '#FFF',
    fontSize: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    width: '90%',
    borderRadius: 5,
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#333',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 25
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20
  },
  toast: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  footer: {
    position: 'absolute',
    bottom: 15
  },
  logo: {
    flex: 1,
    maxWidth: '90%',
    maxHeight: 90,
    resizeMode: 'contain',
  }
})