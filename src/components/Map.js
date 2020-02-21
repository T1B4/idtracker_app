import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Icons from 'react-native-vector-icons/Ionicons'
import StatusIcon from 'react-native-vector-icons/FontAwesome'
import Header from '../components/Header'
import moment from 'moment'

export default class Map extends Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return ({
      placa: this.props.placa,
      modelo: this.props.modelo,
      lat: this.props.lat,
      long: this.props.long,
      time: this.props.time,
      latDelta: 0.09,
      longDelta: 0.04,
      zoomLevel: 0,
      panico: this.props.navigation.getParam('panico'),
      ignicao: this.props.navigation.getParam('ignicao'),
      tracker: this.props.navigation.getParam('tracker'),
      color: {
        on: '#38b040',
        off: '#ccc',
        alerta: '#ff4500'
      }
    })
  }

  markerColor = () => {
    if (this.state.panico == '1') {
      return (this.state.color.alerta)
    } else if (this.state.ignicao == '1') {
      return (this.state.color.on)
    } else {
      return (this.state.color.off)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          loadingEnabled={true}
          minZoomLevel={this.state.zoomLevel}
          maxZoomLevel={20}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={{
            latitude: parseFloat(this.props.lat),
            longitude: parseFloat(this.props.long),
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.longDelta
          }}>
          <Marker title={this.state.tracker} description={this.state.placa} coordinate={{ latitude: parseFloat(this.props.lat), longitude: parseFloat(this.props.long) }} >
            <Icons name='md-pin' size={50} color={this.markerColor()} />
          </Marker>
        </MapView>
        <Header {...this.props} title={`Placa: ${this.state.placa}`} />
        <View style={styles.dadosContainer}>
          <Text style={styles.dadosTexto}>Placa: {this.state.placa}</Text>
          {/* <Text style={styles.dadosTexto}>SN Tracker: {this.state.tracker}</Text> */}
          <Text style={styles.dadosTexto}>Última Atualização: {moment.unix(this.props.time).format("DD/MM/YYYY H:mm:ss")}</Text>
          {/* <Text style={styles.dadosTexto}>Coordenadas: {this.props.lat}, {this.props.long}</Text> */}
          <View style={styles.statusContainer}>
            <Text style={[styles.dadosTexto, {paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4}]}>Ignição   <StatusIcon name="circle" color={this.state.ignicao == 1 ? this.state.color.on : this.state.color.off} size={16} /></Text>
            <TouchableOpacity onPress={() => { this.props.tooglePanic(); this.setState({ panico: this.state.panico == 0 ? 1 : 0 }) }}>
              <Text style={[styles.dadosTexto, {backgroundColor: '#FFF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4, color: '#222'}]}>Pânico   <StatusIcon name="circle" color={this.state.panico == 1 ? this.state.color.on : this.state.color.off} size={16} /></Text>
            </TouchableOpacity>
          </View>
        </View>
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