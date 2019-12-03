import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import Icons from 'react-native-vector-icons/Ionicons'
import Header from '../components/Header'

export default class RouteMap extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return ({
      placa: this.props.placa,
      modelo: this.props.modelo,
      rota: this.props.rota,
      trajetos: [],
      latDelta: 0.09,
      longDelta: 0.04,
      zoomLevel: 12,
      panico: this.props.navigation.getParam('panico'),
      ignicao: this.props.navigation.getParam('ignicao'),
      tracker: this.props.navigation.getParam('tracker'),
      size: 0
    })
  }

  cleanRoute = () => {
    const route = this.state.rota.filter((local, i) => {
      if (i > 0) {
        return (local.lat.substr(0, 7) != this.state.rota[i - 1].lat.substr(0, 7)) || local.lon.substr(0, 7) != this.state.rota[i - 1].lon.substr(0, 7)
      } else {
        return local
      }
    })
    this.setState({ rota: route, size: route.length })
  }

  routeDivider = () => {
    let trecho = []
    let trajetos = []
    this.state.rota.forEach(local => {
      if (local.ign == 1) {
        trecho = trecho.concat(local)
      } else {
        trajetos.push(trecho)
        trecho = []
      }
    })
    const tracks = trajetos.filter(track => {
      return track.length > 3
    })
    this.setState({ trajetos: tracks })
  }

  componentDidMount() {
    this.cleanRoute()
    // this.routeDivider()
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          loadingEnabled={true}
          loadingIndicatorColor={'#FFF'}
          loadingBackgroundColor={'slateblue'}
          minZoomLevel={this.state.zoomLevel}
          region={{
            latitude: parseFloat(this.state.rota[0].lat),
            longitude: parseFloat(this.state.rota[0].lon),
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.longDelta
          }}>
          <Marker coordinate={{
            latitude: parseFloat(this.state.rota[0].lat),
            longitude: parseFloat(this.state.rota[0].lon)
          }}
            title={'Inicio'}
          >
            <Icons name={'ios-locate'} size={32} color={'royalblue'} />
          </Marker>
          <Polyline
            coordinates={this.state.rota.map((coord, i) => {
              return { latitude: parseFloat(coord.lat), longitude: parseFloat(coord.lon) }
            })
            }
            strokeColor={'mediumturquoise'}
            strokeWidth={3}
          />
          <Marker coordinate={{
            latitude: parseFloat(this.state.rota[this.state.rota.length - 1].lat),
            longitude: parseFloat(this.state.rota[this.state.rota.length - 1].lon)
          }}
            title={'Final'}
          >
            <Icons name={'ios-locate'} size={32} color={'blueviolet'} />
          </Marker>
        </MapView>
        <Header {...this.props} title={`Placa: ${this.state.placa}`} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  dadosContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    left: '5%',
    borderColor: '#CCC',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '90%',
    padding: 10,
  },
  dadosTexto: {
    color: '#FFF',
    fontSize: 14,
    margin: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})