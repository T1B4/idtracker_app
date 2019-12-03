import React, { Component } from 'react'
import { View, FlatList, StyleSheet, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Header from '../components/Header'
import AlertCard from '../components/AlertCard'
import Progress from '../components/Progress'
import axios from 'axios'
import { server, showError } from '../common'

export default class Eventos extends Component {

  interval = ''

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return ({
      id: '',
      trackersList: [],
      list: [],
      fetchNewData: false,
      isVisible: false,
      alertCount: 0
    })
  }

  getUserData = async () => {
    try {
      const res = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(res)
      this.setState({ id: userData.id })
    } catch (err) {
      showError(err.response.data)
    }
  }

  getTrackerData = async () => {
    try {
      const trackers = await axios.get(`${server}/trackers/${this.state.id}/list`)
      this.setState({ trackersList: trackers.data })
    } catch (err) {
      showError(err.response.data)
    }
  }

  getAlertsData = async () => {
    try {
      const trackers = this.state.trackersList.map( tracker => {
        return tracker.s_number
      })
      const msg = await axios.post(`${server}/eventos`, {trackers})
      const total = await axios.put(`${server}/alertas/count`, {trackers})
      this.setState({
        list: msg.data,
        fetchNewData: false,
        alertCount: total.data[0].c - msg.data.length
      })
    } catch (err) {
      showError(err.response.data)
    }
  }

  checkAlert = async id => {
    try {
      await axios.post(`${server}/alertas/${id}`)
      const newList = this.state.list.filter(item => {
        return item.id != id
      })
      this.setState({ list: newList })
    } catch (err) {
      showError(err.response.data)
    }
  }

  componentDidMount = async () => {
    await this.getUserData()
    await this.getTrackerData()
    this.getAlertsData()
    this.interval = setInterval(() => {
      this.getAlertsData()
    }, 50000)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title='Eventos' notificationCount={this.state.list.length} alertCount={this.state.notificationCount}/>
        <Text style={[styles.title, { marginVertical: 10, textAlign: 'center', color: 'slateblue' }]}>Deslize para direita ou esquerda para arquivar um evento!</Text>
        {this.state.list.length > 0 &&
          <FlatList style={{ marginVertical: 8 }} data={this.state.list} refreshing={this.state.fetchNewData} onRefresh={() => { this.setState({ fetchNewData: true }); this.getAlertsData() }} data={this.state.list} keyExtractor={item => `${item.placa + item.id}`} renderItem={
            ({ item }) => <AlertCard id={item.id} key={item.id} alerta={item.alerta} hora={item.timestamp} placa={item.placa} onDismiss={id => this.checkAlert(id)} />
          }></FlatList>}
        <Progress isVisible={this.state.isVisible} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
