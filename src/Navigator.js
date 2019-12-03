import React from 'react'
import { createSwitchNavigator,  createAppContainer} from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import AtualizarVeiculos from './screens/AtualizarVeiculos'
import Localizacao from './screens/Localizacao'
import CadastroVeiculos from './screens/CadastroVeiculos'
import AuthOrApp from './screens/AuthOrApp'
import Login from './screens/Login'
import Menu from './screens/Menu'
import RegistrarRastreador from './screens/RegistrarRastreador'
import RegistrarVeiculos from './screens/RegistrarVeiculos'
import Alertas from './screens/Alertas'
import Eventos from './screens/Eventos'
import Profile from './screens/Profile'
import Relatorios from './screens/Relatorios'
import Trajetos from './screens/Trajetos'
import AlterarSenha from './screens/AlterarSenha'
import Icon from 'react-native-vector-icons/Ionicons'

const hide = () => {
  return null
}

const MenuRoutes = {
  CadastroVeiculos: {
    name: 'CadastroVeiculos',
    screen: props => <CadastroVeiculos {...props} />,
    navigationOptions: {
      title: 'Veículos Cadastrados',
      drawerIcon: () => <Icon name="ios-home" size={28} color='slateblue' />
    }
  },
  Alertas: {
    name: 'Alertas',
    screen: props => <Alertas {...props} />,
    navigationOptions: {
      title: 'Alertas',
      drawerIcon: () => <Icon name="ios-alert" size={28} color='slateblue' />
    }
  },
  Eventos: {
    name: 'Eventos',
    screen: props => <Eventos {...props} />,
    navigationOptions: {
      title: 'Eventos',
      drawerIcon: () => <Icon name="ios-notifications" size={28} color='slateblue' />
    }
  },
  RegistrarVeiculos: {
    name: 'RegistrarVeiculos',
    screen: props => <RegistrarVeiculos {...props} />,
    navigationOptions: {
      title: 'Cadastrar Veículo',
      drawerIcon: () => <Icon name="ios-car" size={28} color='slateblue' />
    }
  },
  RegistrarRastreador: {
    name: 'RegistrarRastreador',
    screen: props => <RegistrarRastreador {...props} />,
    navigationOptions: {
      title: 'Cadastrar Rastreador',
      drawerIcon: () => <Icon name="ios-navigate" size={28} color='slateblue' />
    }
  },
  Profile: {
    name: 'Profile',
    screen: props => <Profile {...props} />,
    navigationOptions: {
      title: 'Perfil do Cliente',
      drawerIcon: () => <Icon name="ios-contact" size={28} color='slateblue' />
    }
  },
  Localizacao: {
    name: 'Localizacao',
    screen: props => <Localizacao {...props} />,
    navigationOptions: {
      title: 'Localização',
      drawerLabel: hide
    }
  },
  AtualizarVeiculos: {
    name: 'AtualizarVeiculos',
    screen: props => <AtualizarVeiculos {...props} />,
    navigationOptions: {
      title: 'Atualizar Veículo',
      drawerLabel: hide
    }
  },
  Relatorios: {
    name: 'Relatorios',
    screen: props => <Relatorios {...props} />,
    navigationOptions: {
      title: 'Relatórios',
      drawerLabel: hide
    }
  },
  Trajetos: {
    name: 'Trajetos',
    screen: props => <Trajetos {...props} />,
    navigationOptions: {
      title: 'Trajetos',
      drawerLabel: hide
    }
  },
  AlterarSenha: {
    name: 'AlterarSenha',
    screen: props => <AlterarSenha {...props} />,
    navigationOptions: {
      title: 'AlterarSenha',
      drawerLabel: hide
    }
  },
}

const MenuConfig = {
  initialRouteName: 'CadastroVeiculos',
  drawerType: 'slide',
  unmountInactiveRoutes: true,
  contentComponent: Menu,
  contentOptions: {
    labelStyle: {
      fontWeight: 'normal',
      fontSize: 16
    },
    activeLabelStyle: {
      color: 'slateblue',
    }
  }
}

const MenuNavigator = createDrawerNavigator(MenuRoutes, MenuConfig)

const MainRoutes = {
  AuthOrApp: {
    name: 'AuthOrApp',
    screen: AuthOrApp,
  },
  Login: {
    name: 'Login',
    screen: Login,
  },
  Home: {
    name: 'Home',
    screen: MenuNavigator,
  },
}

const AppNavigator = createSwitchNavigator(MainRoutes, {
  initialRouteName: 'AuthOrApp'
})
export default createAppContainer(AppNavigator)
