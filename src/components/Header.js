import React, { Component } from 'react'
import { StyleSheet, Text, View, Platform, TouchableOpacity, AppState } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { withNavigation } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { server, showError } from '../common'
import PushNotification from 'react-native-push-notification'
import PushController from '../PushController'

class Header extends Component {

  interval = 0

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      id: '',
      trackersList: [],
      alertas: 0,
      count: 0,
      list: [],
      fetchNewData: false,
      appState: AppState.currentState,
      alertCount: this.props.alertCount > 99 ? '99+' : this.props.alertCount,
      notificationCount: this.props.notificationCount > 99 ? '99+' : this.props.notificationCount,
    }
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
    let result = []
    let alerts = []
    let sum = 0
    try {
      this.state.trackersList.map(async (tracker) => {
        const msg = await axios.get(`${server}/alertas/${tracker.s_number}`)
        sum += 1
        alerts.push = alerts[tracker.id] = msg.data
        result = result.concat(msg.data)
        if (this.state.count.length > 0) {
          let dif = (msg.data.length - this.state.count[(tracker.id)].length)
          if (dif > 0) {
            for (let i = 0; i < dif; i++) {
              this.showNotification(msg.data[i].placa, msg.data[i].alerta)
            }
          }
        }

        const trackers = this.state.trackersList.map(tracker => {
          return tracker.s_number
        })
        const total = await axios.put(`${server}/alertas/count`, { trackers })
        if (this.state.trackersList.length === sum) {
          this.setState({
            list: result,
            fetchNewData: false,
            count: alerts,
            alertCount: result.length > 99 ? '99+' : result.length,
            notificationCount: (total.data[0].c - result.length) > 99 ? '99+' : (total.data[0].c - result.length),
          })
        }
      })
    } catch (err) {
      showError(err.response.data)
    }
  }

  _handleAppStateChange = (nextAppState) => {

    this.setState({ appState: nextAppState });

    if (nextAppState === 'background') {

      clearInterval(this.interval)
      AppState.removeEventListener('change', this._handleAppStateChange)
      AppState.addEventListener('change', this._handleAppStateChange)
      this.interval = setInterval(() => {
        this.getAlertsData()
      }, 50000)

    }

    if (nextAppState === 'active') {

      clearInterval(this.interval)
      AppState.removeEventListener('change', this._handleAppStateChange)
      AppState.addEventListener('change', this._handleAppStateChange)
      this.interval = setInterval(() => {
        this.getAlertsData()
      }, 50000)

    }

    if (nextAppState === 'inactive') {

      clearInterval(this.interval)
      AppState.removeEventListener('change', this._handleAppStateChange)
      AppState.addEventListener('change', this._handleAppStateChange)
      this.interval = setInterval(() => {
        this.getAlertsData()
      }, 50000)

    }
  };

  showNotification = (title, message) => {
    PushNotification.localNotification({
      title,
      message
    })
  }

  componentDidMount = async () => {
    await this.getUserData()
    await this.getTrackerData()
    this.getAlertsData()
    this.props.title ? this.setState({ title: this.props.title }) : 'ID Tracker'
    this.interval = setInterval(() => {
      this.getAlertsData()
    }, 50000)
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Icon name="ios-menu" size={28} color='slateblue' />
          </TouchableOpacity>
        </View>
        <Text style={styles.textHeader}>{this.state.title}</Text>
        <View style={styles.iconBar}>
          <TouchableOpacity style={styles.notification} onPress={() => this.props.navigation.navigate('Alertas', this.props)}>
            <Icon name="ios-alert" size={26} color='slateblue' />
            <View style={styles.badge}>
              <Text style={{ color: 'white', fontSize: 12 }}>{this.state.alertCount}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alert} onPress={() => this.props.navigation.navigate('Eventos', this.props)}>
            <Icon name="ios-notifications" size={28} color='slateblue' />
            <View style={styles.badge}>
              <Text style={{ color: 'white', fontSize: 12 }}>{this.state.notificationCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <PushController />
      </View>
    )
  }
}

export default withNavigation(Header)

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    marginHorizontal: '2.5%',
    height: 44,
    backgroundColor: '#FFF',
    marginTop: 10,
    borderRadius: 8,
    elevation: 5
  },
  textHeader: {
    fontSize: 20,
    color: 'slateblue',
  },
  iconBar: {
    marginHorizontal: 15,
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
  },
  badge: {
    minWidth: 24,
    height: 24,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(235, 64, 52, 0.9)',
    position: 'absolute',
    top: -10,
    right: 15,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 50,
    minHeight: 40,
    marginRight: -15
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 50,
    minHeight: 40,
    marginRight: 0
  }
})
