import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, StatusBar, Image } from 'react-native'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons'
import SafeAreaView from 'react-native-safe-area-view'
import { DrawerNavigatorItems } from 'react-navigation-drawer'
import AsyncStorage from '@react-native-community/async-storage'
import Logo from '../../assets/img/logo.png'

export default props => {

  const logout = () => {
    delete axios.defaults.headers.common['Authorization']
    AsyncStorage.removeItem('userData')
    props.navigation.navigate('Login')
  }

  const profile = () => {
    props.navigation.navigate('Profile')
  }

  const home = () => {
    props.navigation.navigate('CadastroVeiculos')
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <StatusBar backgroundColor="slateblue" barStyle="light-content" />
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={home}>
            <View style={{ flex: 1, alignItems: 'center', width: '100%', height: 60, marginTop: 10 }}>
              <Image source={Logo} style={styles.logo} />
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <View>
              <TouchableOpacity onPress={profile} >
                <Text style={styles.name}>
                  {props.navigation.getParam('usuario')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={profile}>
                <Text style={styles.email}>
                  {props.navigation.getParam('email')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <DrawerNavigatorItems {...props} />
        <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 5 }}>
          <Icon name="md-log-out" size={26}
            color='red' style={{marginLeft: 20, marginTop: 12}} />
          <Text style={{ fontSize: 16, marginLeft: 30, marginTop: 12, fontWeight: 'bold'}}>SAIR</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: '#AAA',
    borderRadius: 30,
    margin: 10,
  },
  name: {
    fontSize: 18,
    marginLeft: 15,
    color: '#fff'
  },
  email: {
    fontSize: 15,
    marginLeft: 15,
    marginBottom: 10,
    color: '#ddd'
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    maxWidth: 260,
    resizeMode: 'contain',
  }
})
