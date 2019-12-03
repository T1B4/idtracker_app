import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu'
import Icon from 'react-native-vector-icons/Ionicons'

class CarOptions extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      panico: this.props.panico,
      id: this.props.id
    }
  }

  _menu = null

  setMenuRef = ref => {
    this._menu = ref
  }

  hideMenu = () => {
    this._menu.hide()
  }

  showMenu = () => {
    this._menu.show()
  }

  navigate = () => {
    this.props.navigation.navigate('Localizacao', {...this.props})
    this.hideMenu()
  }

  verVeiculo = () => {
    this.props.navigation.navigate('AtualizarVeiculos', {...this.props})
    this.hideMenu()
  }

  verRelatorio = () => {
    this.props.navigation.navigate('Relatorios', {...this.props})
    this.hideMenu()
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <Menu ref={this.setMenuRef} animationDuration={0} button={
          <TouchableOpacity onPress={this.showMenu} style={styles.dotIcon}>
            <Icon name="md-more" size={30} color='#FFF' style={{textAlign: 'center', marginRight: -20}} />
          </TouchableOpacity>}>
          <MenuItem onPress={() => this.navigate()}>Localização Atual</MenuItem>
          <MenuDivider color="slateblue" />
          <MenuItem onPress={() => this.verVeiculo()}>Detalhes do Veículo</MenuItem>
          <MenuDivider color="slateblue" />
          <MenuItem onPress={() => {this.props.tooglePanico(); this.hideMenu() }}>{this.state.panico == 0 ? 'Acionar Pânico' : 'Desativar Pânico'}</MenuItem>
          <MenuDivider color="slateblue" />
          <MenuItem onPress={() => this.verRelatorio()}>Relatórios do Veículo</MenuItem>
          <MenuDivider color="slateblue" />
        </Menu>
      </View>
    )
  }
}

export default CarOptions

const styles = StyleSheet.create({
  dotIcon: {
    minWidth: 40,
    minHeight: 40
  }
})
